# Script de Deploy do Frontend para Netlify
Write-Host "Preparando deploy do frontend para Netlify..." -ForegroundColor Green

# 1. Verificar se estamos no diretório correto
if (-not (Test-Path "front-end")) {
    Write-Host "Diretório front-end não encontrado!" -ForegroundColor Red
    Write-Host "Execute este script na raiz do projeto" -ForegroundColor Yellow
    exit 1
}

# 2. Navegar para o frontend
Set-Location front-end

# 3. Instalar dependências
Write-Host "Instalando dependências..." -ForegroundColor Blue
npm install

# 4. Build do frontend
Write-Host "Fazendo build do frontend..." -ForegroundColor Blue
npm run build

# 5. Verificar se o build foi criado
if (-not (Test-Path "build")) {
    Write-Host "Erro: Build não foi criado!" -ForegroundColor Red
    exit 1
}

Write-Host "Build do frontend concluído!" -ForegroundColor Green
Write-Host ""
Write-Host "Agora você pode:" -ForegroundColor Cyan
Write-Host "1. Fazer upload da pasta 'build' para Netlify" -ForegroundColor White
Write-Host "2. Ou conectar o repositório GitHub ao Netlify" -ForegroundColor White
Write-Host "3. Configurar a variável REACT_APP_API_URL com a URL do Render" -ForegroundColor White
Write-Host ""
Write-Host "URL do backend será: https://fila-zero-backend-xxxx.onrender.com" -ForegroundColor Yellow
Write-Host "Configure REACT_APP_API_URL=https://fila-zero-backend-xxxx.onrender.com/api" -ForegroundColor Yellow
