# 🚀 Deploy no Render (Alternativa Gratuita)

## Por que Render?
- **Gratuito** para projetos pequenos
- **Sem verificação de cartão**
- **Deploy automático via Git**
- **Banco de dados incluído**

## Passo 1: Criar Conta no Render

1. **Acesse**: https://render.com
2. **Clique em "Get Started for Free"**
3. **Conecte com GitHub**
4. **Autorize** o acesso ao repositório

## Passo 2: Deploy do Backend

1. **Clique em "New"** → **"Web Service"**
2. **Conecte** seu repositório GitHub
3. **Configure**:
   - **Name**: `fila-zero-backend`
   - **Root Directory**: `FilaZero.Web`
   - **Build Command**: `dotnet build`
   - **Start Command**: `dotnet FilaZero.Web.dll`
   - **Runtime**: `.NET 6`

## Passo 3: Configurar Banco de Dados

1. **Clique em "New"** → **"PostgreSQL"**
2. **Configure**:
   - **Name**: `fila-zero-db`
   - **Database**: `FilaZeroDb`
   - **User**: `fila_zero_user`
   - **Password**: Gerar automaticamente

## Passo 4: Deploy do Frontend

1. **Clique em "New"** → **"Static Site"**
2. **Conecte** seu repositório GitHub
3. **Configure**:
   - **Name**: `fila-zero-frontend`
   - **Root Directory**: `front-end`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `build`

## Passo 5: Configurar Variáveis

### Backend
- `ASPNETCORE_ENVIRONMENT`: `Production`
- `ASPNETCORE_URLS`: `https://+:$PORT`
- `ConnectionStrings__DefaultConnection`: Connection string do PostgreSQL

### Frontend
- `REACT_APP_API_URL`: `https://fila-zero-backend.onrender.com/api`

## URLs de Exemplo

- **Backend**: `https://fila-zero-backend.onrender.com`
- **Frontend**: `https://fila-zero-frontend.onrender.com`

## Vantagens do Render

✅ **Gratuito** para projetos pequenos
✅ **Sem verificação de cartão**
✅ **Deploy automático**
✅ **Banco de dados incluído**
✅ **Logs em tempo real**
✅ **Domínio personalizado**
✅ **SSL automático**

## Comandos Úteis

```bash
# Ver logs do backend
# Acesse o dashboard do Render

# Ver logs do frontend
# Acesse o dashboard do Render

# Ver status
# Acesse o dashboard do Render
```

## Troubleshooting

### Erro de Build
- Verifique se o .NET 6 está configurado
- Verifique se todas as dependências estão corretas

### Erro de Conexão
- Verifique se a connection string está correta
- Verifique se o banco está ativo

### Erro de CORS
- Verifique se o domínio do frontend está configurado no CORS
