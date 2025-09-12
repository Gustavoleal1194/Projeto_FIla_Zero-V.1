# Script de Deploy para Heroku
Write-Host "🚀 Iniciando deploy do FilaZero para Heroku..." -ForegroundColor Green

# 1. Verificar se Heroku CLI está instalado
try {
    $herokuVersion = heroku --version
    Write-Host "✅ Heroku CLI encontrado: $herokuVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Heroku CLI não encontrado. Instalando..." -ForegroundColor Red
    Write-Host "Por favor, instale manualmente: https://devcenter.heroku.com/articles/heroku-cli" -ForegroundColor Yellow
    exit 1
}

# 2. Verificar se está logado
try {
    $whoami = heroku auth:whoami
    Write-Host "✅ Logado como: $whoami" -ForegroundColor Green
} catch {
    Write-Host "❌ Não está logado no Heroku. Fazendo login..." -ForegroundColor Yellow
    Write-Host "Abra o navegador e faça login no Heroku" -ForegroundColor Yellow
    heroku login
}

# 3. Criar app no Heroku (se não existir)
$appName = "fila-zero-backend-$(Get-Random -Maximum 9999)"
Write-Host "📱 Criando app: $appName" -ForegroundColor Blue

try {
    heroku create $appName
    Write-Host "✅ App criado: https://$appName.herokuapp.com" -ForegroundColor Green
} catch {
    Write-Host "⚠️ App já existe ou erro na criação" -ForegroundColor Yellow
}

# 4. Configurar variáveis de ambiente
Write-Host "⚙️ Configurando variáveis de ambiente..." -ForegroundColor Blue

heroku config:set ASPNETCORE_ENVIRONMENT=Production --app $appName
heroku config:set ASPNETCORE_URLS=https://+:$PORT --app $appName

# 5. Configurar buildpack para .NET
Write-Host "🔧 Configurando buildpack..." -ForegroundColor Blue
heroku buildpacks:set https://github.com/jincod/dotnetcore-buildpack --app $appName

# 6. Fazer deploy
Write-Host "📦 Fazendo deploy..." -ForegroundColor Blue
git add .
git commit -m "Deploy para Heroku - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git push heroku main

# 7. Verificar status
Write-Host "🔍 Verificando status do app..." -ForegroundColor Blue
heroku ps --app $appName

Write-Host "🎉 Deploy concluído!" -ForegroundColor Green
Write-Host "🌐 URL do backend: https://$appName.herokuapp.com" -ForegroundColor Cyan
Write-Host "📊 Logs: heroku logs --tail --app $appName" -ForegroundColor Cyan
Write-Host "🔧 Configurações: heroku config --app $appName" -ForegroundColor Cyan
