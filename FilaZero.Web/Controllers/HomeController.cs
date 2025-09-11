using Microsoft.AspNetCore.Mvc;

namespace FilaZero.Web.Controllers
{
    [ApiController]
    [Route("")]
    public class HomeController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            var html = @"
<!DOCTYPE html>
<html lang='pt-BR'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>FilaZero API</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
        }
        .logo {
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .subtitle {
            font-size: 1.2rem;
            margin-bottom: 40px;
            opacity: 0.9;
        }
        .links {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 40px;
        }
        .link-card {
            background: rgba(255,255,255,0.1);
            padding: 30px;
            border-radius: 15px;
            text-decoration: none;
            color: white;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
        }
        .link-card:hover {
            transform: translateY(-5px);
            background: rgba(255,255,255,0.2);
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .link-title {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .link-description {
            font-size: 0.9rem;
            opacity: 0.8;
        }
        .status {
            background: rgba(0,255,0,0.2);
            padding: 10px 20px;
            border-radius: 25px;
            display: inline-block;
            margin-bottom: 20px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class='container'>
        <div class='logo'>🍽️ FilaZero</div>
        <div class='subtitle'>Sistema de Pedidos para Eventos</div>
        <div class='status'>✅ API Online</div>
        
        <div class='links'>
            <a href='/api-docs' class='link-card'>
                <div class='link-title'>📚 Swagger API</div>
                <div class='link-description'>Documentação e teste da API</div>
            </a>
            
            <a href='/health' class='link-card'>
                <div class='link-title'>❤️ Health Check</div>
                <div class='link-description'>Status do sistema</div>
            </a>
            
            <a href='http://localhost:3000' class='link-card' target='_blank'>
                <div class='link-title'>🌐 Frontend</div>
                <div class='link-description'>Interface do usuário</div>
            </a>
            
            <a href='/api' class='link-card'>
                <div class='link-title'>🔌 API Endpoints</div>
                <div class='link-description'>Endpoints disponíveis</div>
            </a>
        </div>
        
        <div style='margin-top: 40px; opacity: 0.7;'>
            <p>🚀 Backend .NET 8.0 | React Frontend | SQL Server Database</p>
        </div>
    </div>
</body>
</html>";

            return Content(html, "text/html");
        }

        [HttpGet("api")]
        public IActionResult GetApiInfo()
        {
            var apiInfo = new
            {
                name = "FilaZero API",
                version = "v1",
                description = "API para o sistema FilaZero - PWA para pedidos em eventos",
                baseUrl = "http://localhost:5000",
                endpoints = new
                {
                    swagger = "/api-docs",
                    health = "/health",
                    frontend = "http://localhost:3000",
                    controllers = new[]
                    {
                        new { name = "Auth", path = "/api/auth", description = "Autenticação e autorização" },
                        new { name = "Pedidos", path = "/api/pedidos", description = "Gerenciamento de pedidos" },
                        new { name = "Produtos", path = "/api/produtos", description = "Gerenciamento de produtos" },
                        new { name = "Categorias", path = "/api/categorias", description = "Gerenciamento de categorias" },
                        new { name = "Eventos", path = "/api/eventos", description = "Gerenciamento de eventos" },
                        new { name = "Pagamentos", path = "/api/pagamentos", description = "Gerenciamento de pagamentos" },
                        new { name = "KDS", path = "/api/kds", description = "Kitchen Display System" },
                        new { name = "Upload", path = "/api/upload", description = "Upload de arquivos" },
                        new { name = "Security", path = "/api/security", description = "Configurações de segurança" }
                    },
                    signalR = new
                    {
                        hub = "/notificationHub",
                        description = "Comunicação em tempo real"
                    }
                },
                status = "online",
                timestamp = DateTime.UtcNow
            };

            return Ok(apiInfo);
        }
    }
}