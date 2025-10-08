# Guia de Configuração do Vercel

## ✅ Passos para Garantir que o Sistema Funcione no Vercel

### 1. Acessar as Configurações do Projeto no Vercel

1. Acesse: https://vercel.com
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**

---

### 2. Adicionar as Variáveis de Ambiente

Adicione cada uma das variáveis abaixo:

#### Variável 1: VITE_SUPABASE_URL
- **Nome:** `VITE_SUPABASE_URL`
- **Valor:** `https://reoszoosrzwlrzkasube.supabase.co`
- **Ambientes:** ✅ Production, ✅ Preview, ✅ Development

#### Variável 2: VITE_SUPABASE_ANON_KEY
- **Nome:** `VITE_SUPABASE_ANON_KEY`
- **Valor:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlb3N6b29zcnp3bHJ6a2FzdWJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MzczMTcsImV4cCI6MjA3NTExMzMxN30.P3dyyTq-fD_NQAHn5ziLazPWvksPNKFKCEhFk05s5rI`
- **Ambientes:** ✅ Production, ✅ Preview, ✅ Development

#### Variável 3: VITE_BASE44_APP_ID
- **Nome:** `VITE_BASE44_APP_ID`
- **Valor:** `68850befb229de9dd8e4dc73`
- **Ambientes:** ✅ Production, ✅ Preview, ✅ Development

#### Variável 4: VITE_BASE44_API_URL
- **Nome:** `VITE_BASE44_API_URL`
- **Valor:** `https://base44.app/api`
- **Ambientes:** ✅ Production, ✅ Preview, ✅ Development

#### Variável 5: VITE_BASE44_FILES_URL
- **Nome:** `VITE_BASE44_FILES_URL`
- **Valor:** `https://base44.app/api/apps/68850befb229de9dd8e4dc73/files`
- **Ambientes:** ✅ Production, ✅ Preview, ✅ Development

---

### 3. Fazer um Novo Deploy

Após adicionar todas as variáveis:

1. Vá em **Deployments**
2. Clique nos 3 pontinhos do último deployment
3. Selecione **Redeploy**
4. Marque a opção **"Use existing Build Cache"** (opcional)
5. Clique em **Redeploy**

**OU**

Faça um novo commit no GitHub e o Vercel fará o deploy automaticamente.

---

### 4. Testar o Sistema

Após o deploy ser concluído:

#### Teste 1: Acessar a Home
```
https://seu-projeto.vercel.app/
```

#### Teste 2: Testar o Login do Admin
```
URL: https://seu-projeto.vercel.app/admin/login
Email: appyon.contact@gmail.com
Senha: #Appyon2025!
```

Você deve ser redirecionado para:
```
https://seu-projeto.vercel.app/analytics
```

#### Teste 3: Verificar Rastreamento
1. Abra: `https://seu-projeto.vercel.app/funnel-1`
2. Abra o **Console do navegador** (F12)
3. Você deve ver mensagens como:
   ```
   ✓ Tracked funnel-1 - intro: true
   ✓ Tracked funnel-1 - video: true
   ```

---

### 5. Verificar Logs do Vercel (Se Houver Problemas)

Se algo não funcionar:

1. Vá em **Deployments**
2. Clique no deployment mais recente
3. Vá em **Functions** ou **Build Logs**
4. Procure por erros relacionados a variáveis de ambiente

---

## 🎯 Credenciais do Admin

**Email:** appyon.contact@gmail.com
**Senha:** #Appyon2025!

---

## 📊 URLs do Sistema

### Frontend (Production)
- Home: `https://seu-projeto.vercel.app/`
- Admin Login: `https://seu-projeto.vercel.app/admin/login`
- Analytics: `https://seu-projeto.vercel.app/analytics`

### Funis Disponíveis
- `/funnel-1` - Funnel 1 (11,362 sessões)
- `/funnel-tt` - Funnel TT (4 sessões)
- `/funnel-vsl` - Funnel VSL (2 sessões)
- `/funnelesp` - Funnel ESP
- `/funnel-star2` - Funil Star 2 (1,066 sessões)
- `/funnel-star3` - Funil Star 3 (1,015 sessões)
- `/funnel-star4` - Funil Star 4 (1 sessão)
- `/funnel-star5` - Funil Star 5

---

## ⚠️ Problemas Comuns

### Erro: "Failed to fetch" no Login

**Causa:** Edge Function não está acessível ou variáveis de ambiente não configuradas.

**Solução:**
1. Verificar se `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão no Vercel
2. Fazer redeploy após adicionar as variáveis
3. Limpar cache do navegador

### Erro: Rastreamento não funciona

**Causa:** Supabase client não inicializado.

**Solução:**
1. Abrir console do navegador (F12)
2. Procurar por erros relacionados a Supabase
3. Verificar se as variáveis `VITE_SUPABASE_*` estão corretas

### Erro: Página em branco após deploy

**Causa:** Build falhou ou roteamento incorreto.

**Solução:**
1. Verificar Build Logs no Vercel
2. Garantir que o arquivo `vercel.json` está presente
3. Verificar se o build local funciona: `npm run build`

---

## 🚀 Status Atual do Sistema

✅ Edge Functions: **DEPLOYADAS E ATIVAS**
✅ Banco de Dados: **CONFIGURADO E OPERACIONAL**
✅ Tabelas de Tracking: **CRIADAS (8 funis)**
✅ Usuário Admin: **CRIADO E ATIVO**
✅ Variáveis .env: **CONFIGURADAS LOCALMENTE**
⚠️ Variáveis Vercel: **PRECISAM SER ADICIONADAS**

---

## 📝 Checklist Final

- [ ] Todas as 5 variáveis foram adicionadas no Vercel
- [ ] Todos os ambientes (Production, Preview, Development) foram marcados
- [ ] Fez redeploy após adicionar as variáveis
- [ ] Testou o login em: `/admin/login`
- [ ] Login redirecionou para: `/analytics`
- [ ] Testou um funil qualquer (ex: `/funnel-1`)
- [ ] Verificou no console que o tracking funciona

---

Se todos os checkboxes acima estiverem marcados, seu sistema está 100% operacional! 🎉
