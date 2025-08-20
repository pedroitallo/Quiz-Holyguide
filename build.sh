#!/bin/bash

# Script de build personalizado para Vercel
echo "🚀 Iniciando build customizado..."

# Limpar cache do npm
echo "🧹 Limpando cache..."
npm cache clean --force

# Instalar dependências com força
echo "📦 Instalando dependências..."
npm install --no-optional --no-audit --no-fund

# Verificar se o Vite está disponível
echo "🔍 Verificando Vite..."
npx vite --version

# Build do projeto
echo "🏗️ Fazendo build..."
npm run build

echo "✅ Build concluído!"
