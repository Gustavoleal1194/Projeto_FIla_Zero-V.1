# 🚀 Deploy Híbrido com Banco Local

## Estratégia
- **Frontend**: Netlify (gratuito)
- **Backend**: Heroku (gratuito com limitações)
- **Banco**: Seu SQL Server local

## Passo 1: Configurar SQL Server

### 1.1 Habilitar Conexão Externa
```sql
-- No SQL Server Management Studio
-- 1. Server Properties → Security
-- 2. Habilitar "SQL Server and Windows Authentication mode"
-- 3. Restart SQL Server
```

### 1.2 Criar Usuário
```sql
CREATE LOGIN [fila_zero_heroku] WITH PASSWORD = 'Heroku123!@#';
USE FilaZeroDb;
CREATE USER [fila_zero_heroku] FOR LOGIN [fila_zero_heroku];
ALTER ROLE db_datareader ADD MEMBER [fila_zero_heroku];
ALTER ROLE db_datawriter ADD MEMBER [fila_zero_heroku];
```

## Passo 2: Deploy Backend no Heroku

### 2.1 Configurar Heroku
```bash
# Login
heroku login

# Criar app
heroku create fila-zero-backend-gustavo

# Configurar variáveis
heroku config:set ASPNETCORE_ENVIRONMENT=Production
heroku config:set ConnectionStrings__DefaultConnection="Server=SEU_IP_PUBLICO,1433;Database=FilaZeroDb;User Id=fila_zero_heroku;Password=Heroku123!@#;MultipleActiveResultSets=true;TrustServerCertificate=true;"
```

### 2.2 Deploy
```bash
git add .
git commit -m "Deploy para Heroku"
git push heroku main
```

## Passo 3: Deploy Frontend no Netlify

### 3.1 Build Local
```bash
cd front-end
npm run build
```

### 3.2 Deploy
1. Acesse: https://netlify.com
2. **New site from Git**
3. **Conecte** GitHub
4. **Configure**:
   - **Base directory**: `front-end`
   - **Build command**: `npm run build`
   - **Publish directory**: `front-end/build`

### 3.3 Variáveis de Ambiente
```env
REACT_APP_API_URL=https://fila-zero-backend-gustavo.herokuapp.com/api
```

## URLs Finais
- **Frontend**: `https://fila-zero-demo.netlify.app`
- **Backend**: `https://fila-zero-backend-gustavo.herokuapp.com`

## Vantagens
- ✅ **Totalmente gratuito**
- ✅ **Usa seu banco local**
- ✅ **Deploy automático**
- ✅ **Domínios personalizados**
