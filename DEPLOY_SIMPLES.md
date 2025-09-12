# 🚀 Deploy Simples - FilaZero

## Passo 1: Obter Token do Heroku

1. **Acesse**: https://dashboard.heroku.com/account
2. **Role para baixo** até "API Key"
3. **Clique em "Reveal"** e copie o token
4. **Cole o token** quando solicitado

## Passo 2: Executar Deploy

```powershell
# Execute o script
.\deploy-heroku-token.ps1
```

## Passo 3: Configurar Frontend no Netlify

1. **Acesse**: https://netlify.com
2. **Clique em "New site from Git"**
3. **Conecte** seu repositório GitHub
4. **Configure**:
   - Base directory: `front-end`
   - Build command: `npm run build`
   - Publish directory: `front-end/build`
5. **Adicione variável**:
   - `REACT_APP_API_URL`: `https://seu-app.herokuapp.com/api`

## Passo 4: Testar Sistema

- **Frontend**: URL do Netlify
- **Backend**: URL do Heroku
- **Teste**: Login de gestor e consumidor

## URLs de Exemplo

- **Backend**: `https://fila-zero-backend-1234.herokuapp.com`
- **Frontend**: `https://fila-zero-demo.netlify.app`

## Comandos Úteis

```powershell
# Ver logs do Heroku
heroku logs --tail --app fila-zero-backend-1234

# Ver configurações
heroku config --app fila-zero-backend-1234

# Reiniciar app
heroku restart --app fila-zero-backend-1234
```

## Troubleshooting

### Erro de Token
- Verifique se o token está correto
- Gere um novo token se necessário

### Erro de Deploy
- Verifique se o Git está configurado
- Verifique se há arquivos não commitados

### Erro de CORS
- Verifique se o domínio do Netlify está configurado no CORS
