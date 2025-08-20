#!/bin/bash

# Script de build personalizado para Vercel
echo "🚀 Iniciando build customizado..."

# Verificar se o Vite está disponível
echo "🔍 Verificando Vite..."
npx vite --version

# Build do projeto
echo "🏗️ Fazendo build..."
npx vite build

echo "✅ Build concluído!"
