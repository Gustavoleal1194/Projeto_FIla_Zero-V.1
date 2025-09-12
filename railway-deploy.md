# 🚀 Deploy no Railway (Alternativa Gratuita)

## Por que Railway?
- **Gratuito** para projetos pequenos
- **Sem verificação de cartão**
- **Deploy automático via Git**
- **Banco de dados incluído**

## Passo 1: Criar Conta no Railway

1. **Acesse**: https://railway.app
2. **Clique em "Start a New Project"**
3. **Conecte com GitHub**
4. **Autorize** o acesso ao repositório

## Passo 2: Deploy do Backend

1. **Clique em "Deploy from GitHub repo"**
2. **Selecione** seu repositório
3. **Configure**:
   - **Root Directory**: `FilaZero.Web`
   - **Build Command**: `dotnet build`
   - **Start Command**: `dotnet run`

## Passo 3: Configurar Banco de Dados

1. **Clique em "New"** → **"Database"** → **"PostgreSQL"**
2. **Copie** a connection string
3. **Configure** no backend:
   - `ConnectionStrings__DefaultConnection`

## Passo 4: Deploy do Frontend

1. **Crie novo projeto** no Railway
2. **Configure**:
   - **Root Directory**: `front-end`
   - **Build Command**: `npm run build`
   - **Start Command**: `npx serve -s build`

## Passo 5: Configurar Variáveis

### Backend
- `ASPNETCORE_ENVIRONMENT`: `Production`
- `ASPNETCORE_URLS`: `https://+:$PORT`

### Frontend
- `REACT_APP_API_URL`: `https://seu-backend.railway.app/api`

## URLs de Exemplo

- **Backend**: `https://fila-zero-backend.railway.app`
- **Frontend**: `https://fila-zero-frontend.railway.app`

## Vantagens do Railway

✅ **Gratuito** para projetos pequenos
✅ **Sem verificação de cartão**
✅ **Deploy automático**
✅ **Banco de dados incluído**
✅ **Logs em tempo real**
✅ **Domínio personalizado**

## Comandos Úteis

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up

# Ver logs
railway logs

# Ver status
railway status
```
