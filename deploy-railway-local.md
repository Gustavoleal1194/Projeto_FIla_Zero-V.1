# 🚀 Deploy no Railway com Banco Local

## Por que Railway?
- ✅ **Gratuito** para projetos pequenos
- ✅ **Sem verificação de cartão**
- ✅ **Deploy automático via Git**
- ✅ **Aceita conexões externas** (seu SQL Server)

## Passo 1: Configurar Conexão Externa

### 1.1 Configurar SQL Server para Conexão Externa
```sql
-- No SQL Server Management Studio
-- 1. Habilitar TCP/IP
-- 2. Configurar porta 1433
-- 3. Habilitar autenticação mista
-- 4. Criar usuário para conexão externa
```

### 1.2 Criar Usuário para Conexão Externa
```sql
-- Criar login
CREATE LOGIN [fila_zero_remote] WITH PASSWORD = 'SuaSenhaSegura123!';

-- Criar usuário no banco
USE FilaZeroDb;
CREATE USER [fila_zero_remote] FOR LOGIN [fila_zero_remote];

-- Dar permissões
ALTER ROLE db_datareader ADD MEMBER [fila_zero_remote];
ALTER ROLE db_datawriter ADD MEMBER [fila_zero_remote];
```

## Passo 2: Configurar Firewall

### 2.1 Windows Firewall
```powershell
# Permitir porta 1433
netsh advfirewall firewall add rule name="SQL Server" dir=in action=allow protocol=TCP localport=1433
```

### 2.2 Router (Se necessário)
- Abrir porta 1433 no router
- Configurar port forwarding para seu IP

## Passo 3: Deploy no Railway

### 3.1 Criar Conta
1. Acesse: https://railway.app
2. Conecte com GitHub
3. Autorize acesso ao repositório

### 3.2 Deploy do Backend
1. **New Project** → **Deploy from GitHub repo**
2. **Selecione** seu repositório
3. **Configure**:
   - **Root Directory**: `FilaZero.Web`
   - **Build Command**: `dotnet build`
   - **Start Command**: `dotnet run`

### 3.3 Variáveis de Ambiente
```env
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=https://+:$PORT
ConnectionStrings__DefaultConnection=Server=SEU_IP_PUBLICO,1433;Database=FilaZeroDb;User Id=fila_zero_remote;Password=SuaSenhaSegura123!;MultipleActiveResultSets=true;TrustServerCertificate=true;Connection Timeout=30;
```

## Passo 4: Deploy do Frontend

### 4.1 Novo Projeto no Railway
1. **New Project** → **Deploy from GitHub repo**
2. **Configure**:
   - **Root Directory**: `front-end`
   - **Build Command**: `npm run build`
   - **Start Command**: `npx serve -s build`

### 4.2 Variáveis de Ambiente
```env
REACT_APP_API_URL=https://seu-backend.railway.app/api
REACT_APP_ENVIRONMENT=production
```

## URLs de Exemplo
- **Backend**: `https://fila-zero-backend.railway.app`
- **Frontend**: `https://fila-zero-frontend.railway.app`

## Vantagens
- ✅ **Gratuito**
- ✅ **Deploy automático**
- ✅ **Usa seu banco local**
- ✅ **Sem configuração complexa**
