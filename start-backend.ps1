# Script para iniciar backend com configuração correta
Write-Host "🚀 Iniciando FilaZero Backend..." -ForegroundColor Green

# Verificar se SQL Server está rodando
Write-Host "🔍 Verificando SQL Server..." -ForegroundColor Blue
try {
    $result = sqlcmd -S "GUSTAVO\SQLEXPRESS01" -E -Q "SELECT @@VERSION" -h -1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ SQL Server está rodando" -ForegroundColor Green
    } else {
        Write-Host "❌ SQL Server não está rodando!" -ForegroundColor Red
        Write-Host "Inicie o SQL Server e tente novamente" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "❌ Erro ao conectar com SQL Server!" -ForegroundColor Red
    Write-Host "Verifique se o SQL Server está instalado e rodando" -ForegroundColor Yellow
    exit 1
}

# Verificar se banco existe
Write-Host "🔍 Verificando banco de dados..." -ForegroundColor Blue
try {
    $result = sqlcmd -S "GUSTAVO\SQLEXPRESS01" -E -Q "SELECT name FROM sys.databases WHERE name = 'FilaZeroDb'" -h -1
    if ($result -match "FilaZeroDb") {
        Write-Host "✅ Banco FilaZeroDb encontrado" -ForegroundColor Green
    } else {
        Write-Host "❌ Banco FilaZeroDb não encontrado!" -ForegroundColor Red
        Write-Host "Execute os scripts SQL para criar o banco" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "❌ Erro ao verificar banco de dados!" -ForegroundColor Red
    exit 1
}

# Definir ambiente como Development para usar connection string local
Write-Host "⚙️ Configurando ambiente como Development..." -ForegroundColor Blue
$env:ASPNETCORE_ENVIRONMENT = "Development"

# Iniciar backend
Write-Host "🚀 Iniciando backend..." -ForegroundColor Blue
Write-Host "📡 API estará disponível em: http://localhost:5000" -ForegroundColor Cyan
Write-Host "📚 Swagger estará disponível em: http://localhost:5000/api-docs" -ForegroundColor Cyan
Write-Host "❤️ Health Check estará disponível em: http://localhost:5000/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pressione Ctrl+C para parar o servidor" -ForegroundColor Yellow
Write-Host ""

# Iniciar o backend
dotnet run
