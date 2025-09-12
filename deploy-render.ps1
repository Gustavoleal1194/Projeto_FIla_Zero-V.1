# Script de Deploy para Render
Write-Host "Preparando deploy do FilaZero para Render..." -ForegroundColor Green

# 1. Verificar se estamos no diretório correto
if (-not (Test-Path "FilaZero.Web")) {
    Write-Host "Diretório FilaZero.Web não encontrado!" -ForegroundColor Red
    Write-Host "Execute este script na raiz do projeto" -ForegroundColor Yellow
    exit 1
}

# 2. Verificar se o frontend existe
if (-not (Test-Path "front-end")) {
    Write-Host "Diretório front-end não encontrado!" -ForegroundColor Red
    exit 1
}

# 3. Preparar arquivos para deploy
Write-Host "Preparando arquivos para deploy..." -ForegroundColor Blue

# 4. Fazer commit das mudanças
Write-Host "Fazendo commit das mudanças..." -ForegroundColor Blue
git add .
git commit -m "Deploy para Render - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"

# 5. Push para GitHub
Write-Host "Fazendo push para GitHub..." -ForegroundColor Blue
git push origin main

Write-Host "Arquivos preparados para deploy!" -ForegroundColor Green
Write-Host ""
Write-Host "Agora acesse: https://render.com" -ForegroundColor Cyan
Write-Host "Siga as instruções em: render-deploy.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "Passos rápidos:" -ForegroundColor Yellow
Write-Host "1. Acesse https://render.com" -ForegroundColor White
Write-Host "2. Conecte com GitHub" -ForegroundColor White
Write-Host "3. Crie Web Service para backend" -ForegroundColor White
Write-Host "4. Crie Static Site para frontend" -ForegroundColor White
Write-Host "5. Configure as variáveis de ambiente" -ForegroundColor White
Write-Host ""
Write-Host "Deploy concluído!" -ForegroundColor Green
