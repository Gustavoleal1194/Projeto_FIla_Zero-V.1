# Deploy do Sistema FilaZero no Netlify

## Pré-requisitos
- Conta no Netlify
- Conta no Heroku (para backend)
- Git configurado

## Passo 1: Deploy do Backend no Heroku

### 1.1 Instalar Heroku CLI
```bash
# Windows (via Chocolatey)
choco install heroku

# Ou baixar de: https://devcenter.heroku.com/articles/heroku-cli
```

### 1.2 Login no Heroku
```bash
heroku login
```

### 1.3 Criar App no Heroku
```bash
heroku create fila-zero-backend
```

### 1.4 Configurar Variáveis de Ambiente
```bash
heroku config:set ASPNETCORE_ENVIRONMENT=Production
heroku config:set ConnectionStrings__DefaultConnection="sua-connection-string-aqui"
```

### 1.5 Deploy
```bash
git add .
git commit -m "Deploy para Heroku"
git push heroku main
```

## Passo 2: Deploy do Frontend no Netlify

### 2.1 Build Local (Teste)
```bash
cd front-end
npm install
npm run build
```

### 2.2 Deploy via Netlify CLI
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=front-end/build
```

### 2.3 Deploy via Interface Web
1. Acesse [netlify.com](https://netlify.com)
2. Clique em "New site from Git"
3. Conecte seu repositório GitHub
4. Configure:
   - **Base directory**: `front-end`
   - **Build command**: `npm run build`
   - **Publish directory**: `front-end/build`
5. Adicione variáveis de ambiente:
   - `REACT_APP_API_URL`: `https://fila-zero-backend.herokuapp.com/api`

## Passo 3: Configurar Banco de Dados

### 3.1 Azure SQL Database (Recomendado)
1. Criar conta no Azure
2. Criar SQL Database
3. Configurar firewall para permitir Heroku
4. Atualizar connection string no Heroku

### 3.2 Alternativa: SQL Server Online
- Usar SQL Server gratuito online
- Atualizar connection string

## Passo 4: Testar Sistema

### 4.1 URLs de Teste
- **Frontend**: `https://seu-app.netlify.app`
- **Backend**: `https://fila-zero-backend.herokuapp.com`
- **API Docs**: `https://fila-zero-backend.herokuapp.com/api-docs`

### 4.2 Funcionalidades para Testar
- [ ] Login de gestor
- [ ] Login de consumidor
- [ ] Criação de eventos
- [ ] Cardápio
- [ ] Pedidos
- [ ] Pagamentos PIX

## Passo 5: Configurações de Produção

### 5.1 CORS
- Backend já configurado para aceitar Netlify
- Adicionar domínio do Netlify se necessário

### 5.2 Rate Limiting
- Aumentado para 2000 requisições/15min
- Adequado para produção

### 5.3 Logs
- Heroku logs: `heroku logs --tail`
- Netlify logs: Dashboard do Netlify

## Troubleshooting

### Erro de CORS
- Verificar configuração CORS no backend
- Adicionar domínio do Netlify

### Erro de Conexão
- Verificar connection string
- Verificar firewall do banco

### Erro 429
- Rate limiting muito baixo
- Aumentar limites no Heroku

## Custos Estimados
- **Netlify**: Gratuito (até 100GB bandwidth)
- **Heroku**: $7/mês (Hobby plan)
- **Azure SQL**: $5-15/mês (Basic tier)
- **Total**: ~$12-22/mês
