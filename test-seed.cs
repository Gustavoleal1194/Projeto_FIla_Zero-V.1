using Microsoft.EntityFrameworkCore;
using FilaZero.Infrastructure.Data;

// Configurar conexão
var options = new DbContextOptionsBuilder<FilaZeroDbContext>()
    .UseSqlServer("Server=GUSTAVO\\SQLEXPRESS01;Database=FilaZeroDb;Trusted_Connection=true;MultipleActiveResultSets=true;TrustServerCertificate=true;")
    .Options;

using var context = new FilaZeroDbContext(options);

try
{
    Console.WriteLine("🔍 Testando conexão com banco...");
    
    // Testar conexão
    var canConnect = await context.Database.CanConnectAsync();
    Console.WriteLine($"✅ Conexão: {(canConnect ? "OK" : "FALHOU")}");
    
    if (canConnect)
    {
        // Verificar se já tem dados
        var userCount = await context.Usuarios.CountAsync();
        Console.WriteLine($"👥 Usuários no banco: {userCount}");
        
        if (userCount == 0)
        {
            Console.WriteLine("🌱 Populando banco com dados iniciais...");
            var seedService = new FilaZero.Infrastructure.Data.SeedDataService(context);
            await seedService.SeedAsync();
            Console.WriteLine("✅ Banco populado com sucesso!");
        }
        else
        {
            Console.WriteLine("ℹ️ Banco já possui dados");
        }
    }
}
catch (Exception ex)
{
    Console.WriteLine($"❌ Erro: {ex.Message}");
}

