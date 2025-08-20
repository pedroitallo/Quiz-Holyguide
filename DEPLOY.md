# Guia de Deploy na Vercel - Quiz Holyguide

Este guia te ajudará a fazer o deploy do seu front-end React (Quiz Holyguide) na Vercel, mantendo a conexão com o back-end do Base44.

## ✅ Preparações já realizadas

- [x] **Configuração do Vite**: Projeto já configurado com Vite
- [x] **Cliente Base44**: Configurado para usar variáveis de ambiente
- [x] **Vercel.json**: Arquivo de configuração criado
- [x] **Variáveis de ambiente**: Template criado (`env.example`)
- [x] **Utilitários**: Sistema de configuração flexível criado

## 🚀 Passo a passo para deploy

### 1. Commit das mudanças no Git

```bash
# No terminal do Cursor, execute:
git add .
git commit -m "feat: configuração para deploy na Vercel"
git push origin main
```

### 2. Acesse a Vercel

1. Vá para [vercel.com](https://vercel.com)
2. Faça login com sua conta (GitHub/GitLab/Bitbucket)
3. Clique em "New Project"

### 3. Importe seu repositório

1. Selecione o repositório `Quiz-Holyguide`
2. A Vercel detectará automaticamente que é um projeto Vite
3. **NÃO mude nenhuma configuração ainda** - clique em "Deploy"

### 4. Configure as variáveis de ambiente

Após o primeiro deploy (que pode falhar), vá para:

1. **Project Settings** → **Environment Variables**
2. Adicione as seguintes variáveis:

```
VITE_BASE44_APP_ID = 68850befb229de9dd8e4dc73
VITE_BASE44_API_URL = https://base44.app/api
VITE_BASE44_FILES_URL = https://base44.app/api/apps/68850befb229de9dd8e4dc73/files
VITE_SUPABASE_BASE_URL = https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public
NODE_ENV = production
```

### 5. Force um novo deploy

1. Vá para **Deployments**
2. Clique nos "..." do último deploy
3. Selecione "Redeploy"

## 🔧 Configurações importantes

### Build Settings (já configuradas no vercel.json)

- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Domains e SSL

- A Vercel fornece HTTPS automaticamente
- Você receberá um domínio tipo: `quiz-holyguide.vercel.app`
- Pode configurar domínio customizado depois

## 🧪 Teste o deploy

1. Acesse a URL fornecida pela Vercel
2. Teste as funcionalidades principais:
   - Carregamento das imagens
   - Funcionamento do quiz
   - Integração com Base44 APIs
   - Autenticação

## 🔄 Atualizações futuras

Para futuras atualizações:

1. Faça as mudanças no código
2. Commit e push para o repositório
3. A Vercel fará o deploy automaticamente

## 🐛 Troubleshooting

### Se as imagens não carregarem:

1. Verifique se as variáveis de ambiente estão corretas
2. Confira no console do navegador se há erros de CORS
3. Teste se as URLs das APIs estão respondendo

### Se o SDK do Base44 não funcionar:

1. Verifique se `VITE_BASE44_APP_ID` está correto
2. Confirme se o domínio da Vercel está autorizado no Base44
3. Teste a autenticação

### Build failures:

1. Rode `npm run build` localmente primeiro
2. Verifique se todas as dependências estão no `package.json`
3. Confira se não há erros de lint/TypeScript

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs de build na Vercel
2. Teste localmente com `npm run build` e `npm run preview`
3. Confirme se todas as APIs do Base44 estão funcionando

---

**✨ Sucesso!** Seu front-end agora roda na Vercel e se conecta ao Base44!
