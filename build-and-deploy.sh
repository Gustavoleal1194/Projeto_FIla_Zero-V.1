#!/bin/bash

echo "🚀 Iniciando deploy do FilaZero..."

# 1. Build do Frontend
echo "📦 Fazendo build do frontend..."
cd front-end
npm install
npm run build
cd ..

# 2. Verificar se build foi bem-sucedido
if [ ! -d "front-end/build" ]; then
    echo "❌ Erro: Build do frontend falhou!"
    exit 1
fi

echo "✅ Build do frontend concluído!"

# 3. Preparar arquivos para Netlify
echo "📁 Preparando arquivos para Netlify..."
cp netlify.toml front-end/
cp front-end/public/_redirects front-end/build/

# 4. Deploy no Netlify (se CLI estiver instalado)
if command -v netlify &> /dev/null; then
    echo "🌐 Fazendo deploy no Netlify..."
    netlify deploy --prod --dir=front-end/build
    echo "✅ Deploy concluído!"
else
    echo "⚠️ Netlify CLI não encontrado. Faça deploy manual:"
    echo "1. Acesse netlify.com"
    echo "2. Arraste a pasta 'front-end/build' para o deploy"
    echo "3. Configure as variáveis de ambiente"
fi

echo "🎉 Deploy concluído com sucesso!"
