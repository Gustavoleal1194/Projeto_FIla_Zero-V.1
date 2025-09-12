# 🔧 Configurar SQL Server para Acesso Remoto

## 1. Habilitar TCP/IP no SQL Server

### Via SQL Server Configuration Manager:
1. Abra **SQL Server Configuration Manager**
2. Vá em **SQL Server Network Configuration** → **Protocols for SQLEXPRESS01**
3. Clique com botão direito em **TCP/IP** → **Properties**
4. Na aba **Protocol**:
   - **Enabled**: `Yes`
5. Na aba **IP Addresses**:
   - **IPAll** → **TCP Port**: `1433`
   - **IPAll** → **TCP Dynamic Ports**: (deixe vazio)
6. Clique **OK**
7. **Reinicie** o SQL Server Service

## 2. Configurar Firewall do Windows

### Abrir Porta 1433:
1. Abra **Windows Defender Firewall**
2. Clique **Advanced settings**
3. Clique **Inbound Rules** → **New Rule**
4. Selecione **Port** → **Next**
5. Selecione **TCP** → **Specific local ports**: `1433` → **Next**
6. Selecione **Allow the connection** → **Next**
7. Marque todas as opções → **Next**
8. **Name**: `SQL Server 1433` → **Finish**

## 3. Configurar SQL Server Authentication

### Via SQL Server Management Studio:
1. Conecte no SQL Server
2. Clique com botão direito no servidor → **Properties**
3. Vá em **Security**:
   - **Server authentication**: `SQL Server and Windows Authentication mode`
4. Clique **OK**

## 4. Criar Usuário para Acesso Remoto

```sql
-- Criar login
CREATE LOGIN [fila_zero_remote] WITH PASSWORD = 'SuaSenhaSegura123!';

-- Dar permissões
USE FilaZeroDb;
CREATE USER [fila_zero_remote] FOR LOGIN [fila_zero_remote];
ALTER ROLE db_owner ADD MEMBER [fila_zero_remote];
```

## 5. Obter IP Público da Sua Máquina

### Via PowerShell:
```powershell
Invoke-WebRequest -Uri "https://ipinfo.io/ip" -UseBasicParsing
```

## 6. Atualizar Connection String no Render

### Nova Connection String:
```
Server=SEU_IP_PUBLICO,1433;Database=FilaZeroDb;User Id=fila_zero_remote;Password=SuaSenhaSegura123!;MultipleActiveResultSets=true;TrustServerCertificate=true;Connection Timeout=30;
```

## 7. Configurar no Render

1. Acesse o dashboard do Render
2. Vá em **Environment**
3. Adicione a variável:
   - **Key**: `ConnectionStrings__DefaultConnection`
   - **Value**: `Server=SEU_IP_PUBLICO,1433;Database=FilaZeroDb;User Id=fila_zero_remote;Password=SuaSenhaSegura123!;MultipleActiveResultSets=true;TrustServerCertificate=true;Connection Timeout=30;`

## ⚠️ Segurança

- **Use senha forte**
- **Configure firewall** adequadamente
- **Monitore** conexões
- **Considere VPN** para maior segurança

## 🚀 Teste

Após configurar, teste a conexão:
```powershell
Invoke-WebRequest -Uri "https://projeto-fila-zero-v-1-2.onrender.com/health" -UseBasicParsing
```
