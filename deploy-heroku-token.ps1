# Script de Deploy para Heroku com Token
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

# 2. Configurar token de autorização
Write-Host "🔑 Configurando token de autorização..." -ForegroundColor Blue
Write-Host "Você precisa obter um token de autorização do Heroku:" -ForegroundColor Yellow
Write-Host "1. Acesse: https://dashboard.heroku.com/account" -ForegroundColor Yellow
Write-Host "2. Role para baixo até 'API Key'" -ForegroundColor Yellow
Write-Host "3. Clique em 'Reveal' e copie o token" -ForegroundColor Yellow
Write-Host "4. Cole o token abaixo:" -ForegroundColor Yellow

$token = Read-Host "Digite seu token do Heroku"
if ($token) {
    $env:HEROKU_API_KEY = $token
    Write-Host "✅ Token configurado!" -ForegroundColor Green
} else {
    Write-Host "❌ Token não fornecido. Saindo..." -ForegroundColor Red
    exit 1
}

# 3. Criar app no Heroku
$appName = "fila-zero-backend-$(Get-Random -Maximum 9999)"
Write-Host "📱 Criando app: $appName" -ForegroundColor Blue

try {
    # Usar curl para criar app via API
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $body = @{
        name = $appName
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "https://api.heroku.com/apps" -Method Post -Headers $headers -Body $body
    Write-Host "✅ App criado: https://$appName.herokuapp.com" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Erro ao criar app: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "Tentando continuar..." -ForegroundColor Yellow
}

# 4. Configurar variáveis de ambiente
Write-Host "⚙️ Configurando variáveis de ambiente..." -ForegroundColor Blue

try {
    # Configurar ASPNETCORE_ENVIRONMENT
    $envBody = @{
        name = "ASPNETCORE_ENVIRONMENT"
        value = "Production"
    } | ConvertTo-Json
    
    Invoke-RestMethod -Uri "https://api.heroku.com/apps/$appName/config-vars" -Method Post -Headers $headers -Body $envBody
    
    # Configurar ASPNETCORE_URLS
    $urlsBody = @{
        name = "ASPNETCORE_URLS"
        value = "https://+:`$PORT"
    } | ConvertTo-Json
    
    Invoke-RestMethod -Uri "https://api.heroku.com/apps/$appName/config-vars" -Method Post -Headers $headers -Body $urlsBody
    
    Write-Host "✅ Variáveis de ambiente configuradas!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Erro ao configurar variáveis: $($_.Exception.Message)" -ForegroundColor Yellow
}

# 5. Fazer deploy via Git
Write-Host "📦 Preparando deploy via Git..." -ForegroundColor Blue

try {
    # Adicionar remote do Heroku
    git remote add heroku https://git.heroku.com/$appName.git
    
    # Fazer commit
    git add .
    git commit -m "Deploy para Heroku - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    
    # Fazer push
    git push heroku main
    
    Write-Host "✅ Deploy concluído!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Erro no deploy: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "Tentando deploy manual..." -ForegroundColor Yellow
    
    # Deploy manual via API
    Write-Host "📦 Fazendo deploy manual..." -ForegroundColor Blue
    
    # Criar tarball do código
    $tarFile = "fila-zero-$(Get-Date -Format 'yyyyMMdd-HHmm').tar.gz"
    tar -czf $tarFile FilaZero.Web/
    
    # Upload para Heroku
    $uploadResponse = Invoke-RestMethod -Uri "https://api.heroku.com/apps/$appName/sources" -Method Post -Headers $headers
    
    # Fazer upload do arquivo
    $uploadUrl = $uploadResponse.source_blob.put_url
    $fileContent = [System.IO.File]::ReadAllBytes($tarFile)
    Invoke-RestMethod -Uri $uploadUrl -Method Put -Body $fileContent -ContentType "application/gzip"
    
    # Criar build
    $buildBody = @{
        source_blob = @{
            url = $uploadResponse.source_blob.get_url
            version = "v1"
        }
    } | ConvertTo-Json
    
    Invoke-RestMethod -Uri "https://api.heroku.com/apps/$appName/builds" -Method Post -Headers $headers -Body $buildBody
    
    Write-Host "✅ Deploy manual concluído!" -ForegroundColor Green
}

Write-Host "🎉 Deploy concluído!" -ForegroundColor Green
Write-Host "🌐 URL do backend: https://$appName.herokuapp.com" -ForegroundColor Cyan
Write-Host "📊 Para ver logs: heroku logs --tail --app $appName" -ForegroundColor Cyan
Write-Host "🔧 Para ver configurações: heroku config --app $appName" -ForegroundColor Cyan
