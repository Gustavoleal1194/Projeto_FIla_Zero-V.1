# 🚀 Guia de Deploy Automático - FilaZero

## Opção 1: Deploy Manual via Heroku CLI

### 1.1 Instalar Heroku CLI
```powershell
# Windows (já instalado)
winget install Heroku.HerokuCLI

# Ou baixar de: https://devcenter.heroku.com/articles/heroku-cli
```

### 1.2 Login no Heroku
```powershell
heroku login
# Abra o navegador e faça login
```

### 1.3 Executar Script de Deploy
```powershell
# Execute o script PowerShell
.\deploy-heroku.ps1
```

## Opção 2: Deploy Automático via GitHub Actions

### 2.1 Configurar Secrets no GitHub
1. Acesse seu repositório no GitHub
2. Vá em **Settings** → **Secrets and variables** → **Actions**
3. Adicione os secrets:
   - `HEROKU_API_KEY`: Sua API key do Heroku
   - `HEROKU_EMAIL`: Seu email do Heroku

### 2.2 Obter API Key do Heroku
```powershell
# Login no Heroku
heroku login

# Obter API key
heroku auth:token
```

### 2.3 Fazer Push para GitHub
```powershell
git add .
git commit -m "Configuração para deploy automático"
git push origin main
```

## Opção 3: Deploy via Netlify (Frontend)

### 3.1 Conectar Repositório
1. Acesse [netlify.com](https://netlify.com)
2. Clique em **New site from Git**
3. Conecte seu repositório GitHub

### 3.2 Configurar Build
- **Base directory**: `front-end`
- **Build command**: `npm run build`
- **Publish directory**: `front-end/build`

### 3.3 Variáveis de Ambiente
- `REACT_APP_API_URL`: `https://fila-zero-backend.herokuapp.com/api`
- `REACT_APP_ENVIRONMENT`: `production`

## Configuração do Banco de Dados

### Opção 1: Azure SQL Database (Recomendado)
1. Criar conta no Azure
2. Criar SQL Database
3. Configurar firewall para permitir Heroku
4. Atualizar connection string

### Opção 2: SQL Server Online Gratuito
1. Usar SQL Server gratuito online
2. Atualizar connection string no Heroku

### Opção 3: PostgreSQL no Heroku (Gratuito)
```powershell
# Adicionar addon PostgreSQL
heroku addons:create heroku-postgresql:mini --app fila-zero-backend

# Ver connection string
heroku config:get DATABASE_URL --app fila-zero-backend
```

## Verificação do Deploy

### Backend
```powershell
# Verificar status
heroku ps --app fila-zero-backend

# Ver logs
heroku logs --tail --app fila-zero-backend

# Testar API
curl https://fila-zero-backend.herokuapp.com/api/health
```

### Frontend
- Acesse a URL do Netlify
- Teste login de gestor
- Teste login de consumidor
- Verifique funcionalidades

## Troubleshooting

### Erro de Build
```powershell
# Ver logs detalhados
heroku logs --tail --app fila-zero-backend

# Verificar configurações
heroku config --app fila-zero-backend
```

### Erro de CORS
- Verificar configuração CORS no backend
- Adicionar domínio do Netlify

### Erro de Conexão
- Verificar connection string
- Verificar firewall do banco

## Custos Estimados

### Heroku
- **Hobby Plan**: $7/mês
- **PostgreSQL Mini**: Gratuito (até 10.000 linhas)

### Netlify
- **Starter Plan**: Gratuito
- **Bandwidth**: 100GB/mês

### Total
- **Mínimo**: $7/mês
- **Recomendado**: $14/mês (com banco dedicado)

## URLs de Produção

- **Frontend**: `https://fila-zero-demo.netlify.app`
- **Backend**: `https://fila-zero-backend.herokuapp.com`
- **API Docs**: `https://fila-zero-backend.herokuapp.com/api-docs`

## Comandos Úteis

```powershell
# Ver status do app
heroku ps --app fila-zero-backend

# Ver logs em tempo real
heroku logs --tail --app fila-zero-backend

# Reiniciar app
heroku restart --app fila-zero-backend

# Ver configurações
heroku config --app fila-zero-backend

# Abrir app no navegador
heroku open --app fila-zero-backend
```
