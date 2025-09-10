using Microsoft.EntityFrameworkCore;
using FilaZero.Infrastructure.Data;
using FilaZero.Infrastructure.Extensions;
using FilaZero.Application.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using FilaZero.Web.Hubs;
using FilaZero.Web.Middleware;
using FilaZero.Web.HealthChecks;
using FilaZero.Application.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configurar Entity Framework
builder.Services.AddInfrastructure(builder.Configuration);

// Configurar serviços de aplicação
builder.Services.AddApplication();

// Configurar SignalR
builder.Services.AddSignalR();

// Registrar serviços da Web
builder.Services.AddScoped<FilaZero.Domain.Interfaces.Services.INotificationService, FilaZero.Web.Services.NotificationService>();

// Registrar serviços de segurança
builder.Services.AddScoped<FilaZero.Web.Security.JwtService>();
builder.Services.AddSingleton<FilaZero.Web.Security.RateLimitingService>();

// Registrar serviços de cache e logging
builder.Services.AddMemoryCache();
builder.Services.AddScoped<ICacheService, CacheService>();


// Configurar logging estruturado
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.AddEventSourceLogger();

// Configurar CORS para PWA (SEGURO)
builder.Services.AddCors(options =>
{
    options.AddPolicy("FilaZeroPolicy", policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000",
                "https://localhost:3000",
                "http://127.0.0.1:3000",
                "https://127.0.0.1:3000"
              )
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials(); // Necessário para SignalR
    });
});

// Configurar JWT Authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
var secretKey = jwtSettings["SecretKey"];

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
        };
    });

builder.Services.AddAuthorization();

// Configurar Health Checks
builder.Services.AddHealthChecks()
    .AddCheck<DatabaseHealthCheck>("database")
    .AddCheck("memory", () => Microsoft.Extensions.Diagnostics.HealthChecks.HealthCheckResult.Healthy("Memory is OK"));

// Configurar Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { 
        Title = "Fila Zero API", 
        Version = "v1",
        Description = "API para o sistema Fila Zero - PWA para pedidos em eventos"
    });
    
    // Configurar autenticação JWT no Swagger
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Fila Zero API v1");
        c.RoutePrefix = "api-docs";
    });
}
else
{
    app.UseHsts();
}

app.UseHttpsRedirection();

// Middlewares de logging e exceções
app.UseMiddleware<LoggingMiddleware>();
app.UseMiddleware<GlobalExceptionMiddleware>();


// Middlewares de segurança
app.UseMiddleware<FilaZero.Web.Security.SecurityHeadersMiddleware>();
app.UseMiddleware<FilaZero.Web.Middleware.RateLimitingMiddleware>();

app.UseCors("FilaZeroPolicy");

app.UseAuthentication();
app.UseAuthorization();

// Health Checks
app.UseHealthChecks("/health");
app.UseHealthChecks("/health/ready", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("ready")
});

// Mapear apenas rotas de API
app.MapControllers();

// Mapear SignalR Hub
app.MapHub<NotificationHub>("/notificationHub");

// Aplicar migrações automaticamente em desenvolvimento
if (app.Environment.IsDevelopment())
{
    try
    {
        using var scope = app.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<FilaZeroDbContext>();
        await context.Database.EnsureCreatedAsync();
        Console.WriteLine("Banco de dados criado com sucesso!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Erro ao criar banco de dados: {ex.Message}");
        // Continue mesmo com erro no banco
    }
}

app.Run();