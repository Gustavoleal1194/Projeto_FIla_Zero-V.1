# 🚀 Deploy no Render com Banco Local

## Passo 1: Configurar SQL Server

### 1.1 Habilitar Conexão Externa
```sql
-- No SQL Server Configuration Manager
-- 1. SQL Server Network Configuration
-- 2. Protocols for SQLEXPRESS
-- 3. Habilitar TCP/IP
-- 4. Configurar porta 1433
```

### 1.2 Criar Usuário Remoto
```sql
-- Criar login
CREATE LOGIN [fila_zero_render] WITH PASSWORD = 'Render123!@#';

-- Criar usuário
USE FilaZeroDb;
CREATE USER [fila_zero_render] FOR LOGIN [fila_zero_render];

-- Permissões
ALTER ROLE db_datareader ADD MEMBER [fila_zero_render];
ALTER ROLE db_datawriter ADD MEMBER [fila_zero_render];
```

## Passo 2: Deploy no Render

### 2.1 Backend
1. **New** → **Web Service**
2. **Conecte** GitHub
3. **Configure**:
   - **Root Directory**: `FilaZero.Web`
   - **Build Command**: `dotnet build`
   - **Start Command**: `dotnet FilaZero.Web.dll`

### 2.2 Variáveis de Ambiente
```env
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=https://+:$PORT
ConnectionStrings__DefaultConnection=Server=SEU_IP_PUBLICO,1433;Database=FilaZeroDb;User Id=fila_zero_render;Password=Render123!@#;MultipleActiveResultSets=true;TrustServerCertificate=true;
```

### 2.3 Frontend
1. **New** → **Static Site**
2. **Configure**:
   - **Root Directory**: `front-end`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `build`

## URLs
- **Backend**: `https://fila-zero-backend.onrender.com`
- **Frontend**: `https://fila-zero-frontend.onrender.com`
