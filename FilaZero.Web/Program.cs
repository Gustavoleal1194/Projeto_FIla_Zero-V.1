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

// Configurar para aceitar qualquer hostname
builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxConcurrentConnections = 1000;
    options.Limits.MaxConcurrentUpgradedConnections = 1000;
    options.Limits.MaxRequestBodySize = 10 * 1024 * 1024; // 10MB
    // Desabilitar validação de hostname
    options.Limits.KeepAliveTimeout = TimeSpan.FromMinutes(5);
    options.Limits.RequestHeadersTimeout = TimeSpan.FromMinutes(2);
    options.Limits.MaxRequestBufferSize = 1024 * 1024; // 1MB
    options.Limits.MaxResponseBufferSize = 1024 * 1024; // 1MB
});

// Configurar URLs para aceitar qualquer hostname
builder.WebHost.UseUrls("http://*:5000");

// Desabilitar validação de hostname
builder.Services.Configure<Microsoft.AspNetCore.HostFiltering.HostFilteringOptions>(options =>
{
    options.AllowedHosts = new[] { "*" };
    options.AllowEmptyHosts = true;
});

Console.WriteLine("🚀 Iniciando FilaZero Backend...");

// Add services to the container.
builder.Services.AddControllers();
Console.WriteLine("✅ Controllers registrados");

// Configurar Entity Framework
builder.Services.AddInfrastructure(builder.Configuration);
Console.WriteLine("✅ Infrastructure registrada");

// Configurar serviços de aplicação
builder.Services.AddApplication();
Console.WriteLine("✅ Application registrada");

// Configurar SignalR
builder.Services.AddSignalR(options =>
{
    options.EnableDetailedErrors = true;
});
Console.WriteLine("✅ SignalR registrado");

// Registrar serviços da Web
builder.Services.AddScoped<FilaZero.Domain.Interfaces.Services.INotificationService, FilaZero.Web.Services.NotificationService>();
Console.WriteLine("✅ NotificationService registrado");

// Registrar serviços de segurança
builder.Services.AddScoped<FilaZero.Domain.Interfaces.Services.IJwtService, FilaZero.Web.Security.JwtService>();

// Configurar Rate Limiting com configuração
var rateLimitingConfig = builder.Configuration.GetSection("RateLimiting");
var maxRequests = rateLimitingConfig.GetValue<int>("MaxRequests", 1000);
var timeWindowMinutes = rateLimitingConfig.GetValue<int>("TimeWindowMinutes", 15);
builder.Services.AddSingleton<FilaZero.Web.Security.RateLimitingService>(provider => 
    new FilaZero.Web.Security.RateLimitingService(maxRequests, timeWindowMinutes));
Console.WriteLine("✅ Serviços de segurança registrados");

// Registrar PagamentoService
builder.Services.AddScoped<FilaZero.Domain.Interfaces.Services.IPagamentoService, FilaZero.Application.Services.PagamentoService>();
Console.WriteLine("✅ PagamentoService registrado");

// Registrar serviços PIX
builder.Services.AddHttpClient<FilaZero.Application.Services.IGerencianetService, FilaZero.Application.Services.GerencianetService>();
builder.Services.AddScoped<FilaZero.Application.Services.IPixService, FilaZero.Application.Services.PixService>();
Console.WriteLine("✅ Serviços PIX registrados");

// Registrar serviços de cache e logging
builder.Services.AddMemoryCache(options =>
{
    options.SizeLimit = 1000; // Limite de 1000 itens no cache
    options.CompactionPercentage = 0.25; // Remove 25% quando atinge o limite
});
builder.Services.AddScoped<ICacheService, CacheService>();
Console.WriteLine("✅ Cache e logging registrados");


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
                "https://127.0.0.1:3000",
                "https://*.netlify.app",
                "https://fila-zero-demo.netlify.app"
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
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey ?? "FilaZeroSecretKey2024!@#"))
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

Console.WriteLine("🔧 Construindo aplicação...");
var app = builder.Build();
Console.WriteLine("✅ Aplicação construída");

// Configure the HTTP request pipeline.
// Swagger sempre habilitado para facilitar desenvolvimento
Console.WriteLine("🔧 Configurando Swagger...");
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Fila Zero API v1");
    c.RoutePrefix = "api-docs";
});
Console.WriteLine("✅ Swagger configurado");

if (app.Environment.IsDevelopment())
{
    // Executar seed data em desenvolvimento
    using (var scope = app.Services.CreateScope())
    {
        try
        {
            var context = scope.ServiceProvider.GetRequiredService<FilaZeroDbContext>();
            var seedService = new FilaZero.Infrastructure.Data.SeedDataService(context);
            await seedService.SeedAsync();
            Console.WriteLine("✅ Seed data executado com sucesso!");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"⚠️ Erro ao executar seed data: {ex.Message}");
        }
    }
}
else
{
    app.UseHsts();
}

// app.UseHttpsRedirection(); // Temporariamente desabilitado para debug

// Middlewares de logging e exceções
app.UseMiddleware<LoggingMiddleware>();
app.UseMiddleware<GlobalExceptionMiddleware>();


// Middlewares de segurança
app.UseMiddleware<FilaZero.Web.Security.SecurityHeadersMiddleware>();
app.UseMiddleware<FilaZero.Web.Middleware.RateLimitingMiddleware>();

app.UseCors("FilaZeroPolicy");

// Configurar arquivos estáticos para servir imagens
app.UseStaticFiles();

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
Console.WriteLine("🔧 Mapeando SignalR Hub...");
app.MapHub<NotificationHub>("/notificationHub");
Console.WriteLine("✅ SignalR Hub mapeado");

Console.WriteLine("🔧 Mapeando controllers...");
app.MapControllers();
Console.WriteLine("✅ Controllers mapeados");

Console.WriteLine("🔧 Configurando Health Checks...");
app.UseHealthChecks("/health");
app.UseHealthChecks("/health/ready", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("ready")
});
Console.WriteLine("✅ Health Checks configurados");

// Configurar cleanup automático do rate limiting
var rateLimitingService = app.Services.GetRequiredService<FilaZero.Web.Security.RateLimitingService>();
var cleanupTimer = new System.Timers.Timer(TimeSpan.FromMinutes(5).TotalMilliseconds);
cleanupTimer.Elapsed += (sender, e) => rateLimitingService.CleanupOldRequests();
cleanupTimer.Start();

Console.WriteLine("🚀 Iniciando servidor na porta 5000...");
Console.WriteLine("✅ Backend iniciado com sucesso!");
Console.WriteLine("📡 API disponível em: http://localhost:5000");
Console.WriteLine("📡 API disponível em: http://127.0.0.1:5000");
Console.WriteLine("📚 Swagger disponível em: http://localhost:5000/api-docs");
Console.WriteLine("❤️ Health Check disponível em: http://localhost:5000/health");

app.Run();