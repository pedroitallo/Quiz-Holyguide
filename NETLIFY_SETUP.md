# Guia de Configuração no Netlify

Este guia te ajudará a configurar corretamente o projeto no Netlify.

## ✅ Arquivos de Configuração Criados

- **netlify.toml**: Configuração principal do Netlify
- **public/_redirects**: Redirecionamentos para suportar React Router

## 🔧 Configuração no Painel do Netlify

### 1. Build Settings

Estas configurações já estão no arquivo `netlify.toml`, mas confirme no painel:

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18

### 2. Variáveis de Ambiente (OBRIGATÓRIO)

Acesse: **Site settings → Environment variables** e adicione:

```
VITE_SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw
NODE_ENV=production
```

**IMPORTANTE**: Sem estas variáveis, o site não funcionará!

### 3. Domínio Customizado

Se você configurou um domínio customizado:

1. Acesse: **Domain settings → Custom domains**
2. Verifique se o domínio está com status "Active"
3. Confirme se o certificado SSL está ativo (cadeado verde)

#### Configuração DNS:

Para domínio principal (exemplo.com):
```
A Record → 75.2.60.5
```

Para subdomínio (www.exemplo.com):
```
CNAME → seu-site.netlify.app
```

## 🚀 Deploy

### Automático (Recomendado)

Após fazer commit das mudanças no GitHub:

```bash
git add .
git commit -m "fix: adicionar configuração do Netlify"
git push origin main
```

O Netlify fará o deploy automaticamente.

### Manual

No painel do Netlify:
1. Acesse **Deploys**
2. Clique em **Trigger deploy → Deploy site**

## 🔍 Verificando se está funcionando

### 1. Verificar Build

1. Acesse **Deploys** no painel do Netlify
2. Clique no último deploy
3. Veja os logs de build
4. Confirme se o build foi **Published** (sucesso)

### 2. Verificar Site

Teste estas URLs no seu navegador:

- `/` - Página inicial
- `/funnel-1` - Funnel 1
- `/funnel-tt` - Funnel TT
- `/funnel-vsl` - Funnel VSL
- `/admin/login` - Login admin
- `/analytics` - Painel de analytics

### 3. Verificar Console do Navegador

1. Abra seu site
2. Pressione F12 (DevTools)
3. Vá para aba **Console**
4. Não deve haver erros vermelhos relacionados a variáveis de ambiente ou Supabase

## 🐛 Problemas Comuns

### Erro: "Site not found" ou página em branco

**Solução**: Verifique se as variáveis de ambiente estão configuradas corretamente.

```bash
# No painel do Netlify, vá em:
Site settings → Environment variables
```

### Erro 404 nas rotas do React Router

**Solução**: Já resolvido! O arquivo `public/_redirects` garante que todas as rotas funcionem.

### Build falha com erro de módulo

**Solução**:
1. Verifique os logs de build no Netlify
2. Confirme se todas as dependências estão no `package.json`
3. Teste localmente: `npm run build`

### Imagens não carregam

**Solução**: Verifique se os arquivos estão na pasta `public/` e se as URLs estão corretas.

### Erro de CORS ou API

**Solução**: Verifique se as variáveis VITE_SUPABASE_* estão configuradas no Netlify.

## 📊 Monitoramento

### Logs de Deploy

Acesse: **Deploys → [Último deploy] → Deploy log**

Aqui você verá:
- Instalação de dependências
- Processo de build
- Publicação dos arquivos
- Erros (se houver)

### Logs de Função (Se aplicável)

Acesse: **Functions → [Nome da função] → Logs**

### Analytics

O Netlify oferece analytics integrado:
- Acesse: **Analytics** no menu lateral
- Veja visitantes, pageviews, bandwidth

## 🔐 Segurança

As seguintes configurações de segurança já estão ativas:

- **X-Frame-Options**: DENY (previne clickjacking)
- **X-XSS-Protection**: Proteção contra XSS
- **X-Content-Type-Options**: nosniff
- **Cache-Control**: Cache otimizado para assets

## 📞 Suporte

Se continuar com problemas:

1. Verifique os logs de build no Netlify
2. Teste localmente: `npm run build && npm run preview`
3. Confirme todas as variáveis de ambiente
4. Verifique se o domínio está apontando corretamente

---

**✨ Seu projeto agora está pronto para funcionar no Netlify!**
