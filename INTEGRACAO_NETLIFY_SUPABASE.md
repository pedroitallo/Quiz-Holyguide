# Integração Netlify + Supabase - Guia Completo

## 📋 Passo a Passo

### ✅ Parte 1: Pegar suas credenciais do Supabase

1. **Acesse o painel do Supabase**
   - Vá para: https://supabase.com/dashboard
   - Faça login na sua conta

2. **Abra seu projeto**
   - Clique no projeto que está usando (ID: 0ec90b57d6e95fcbda19832f)

3. **Copie as credenciais**
   - No menu lateral, clique em: **Settings** (⚙️ Configurações)
   - Clique em: **API**
   - Você verá duas informações importantes:

   ```
   Project URL: https://0ec90b57d6e95fcbda19832f.supabase.co
   anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

   **IMPORTANTE**: Use a chave `anon public` (NÃO use a service_role key!)

---

### ✅ Parte 2: Configurar no Netlify

1. **Acesse o painel do Netlify**
   - Vá para: https://app.netlify.com
   - Faça login na sua conta

2. **Selecione seu site**
   - Clique no site que está conectado ao seu projeto

3. **Abra as configurações**
   - No menu superior, clique em: **Site configuration**
   - No menu lateral esquerdo, clique em: **Environment variables**
   - Ou acesse diretamente: Site configuration → Environment variables

4. **Adicione as variáveis de ambiente**

   Clique no botão: **Add a variable** ou **Add environment variables**

   Adicione cada variável individualmente:

   **Variável 1:**
   ```
   Key: VITE_SUPABASE_URL
   Value: https://0ec90b57d6e95fcbda19832f.supabase.co
   ```
   *(Copie a URL do passo 1.3)*

   **Variável 2:**
   ```
   Key: VITE_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw
   ```
   *(Copie a chave anon do passo 1.3)*

   **Variável 3:**
   ```
   Key: NODE_ENV
   Value: production
   ```

5. **Salve as variáveis**
   - Clique em: **Save** ou **Create variable** para cada uma

---

### ✅ Parte 3: Fazer o Deploy

Agora você tem 2 opções:

#### Opção A: Deploy Automático (Recomendado)

Se seu projeto está conectado ao GitHub:

1. Faça commit das mudanças:
   ```bash
   git add .
   git commit -m "fix: configuração Netlify + Supabase"
   git push origin main
   ```

2. O Netlify vai detectar o push e fazer o deploy automaticamente
3. Aguarde 2-3 minutos

#### Opção B: Forçar Deploy Manual

No painel do Netlify:

1. Vá para: **Deploys** (menu superior)
2. Clique no botão: **Trigger deploy**
3. Selecione: **Deploy site**
4. Aguarde o build terminar

---

### ✅ Parte 4: Verificar se Funcionou

1. **Acesse seu site**
   - Use o domínio do Netlify (exemplo: seu-site.netlify.app)
   - Ou use seu domínio customizado

2. **Abra o Console do Navegador**
   - Pressione **F12** (ou Cmd+Option+I no Mac)
   - Vá para a aba **Console**

3. **Procure pelas mensagens de log**

   Você deve ver:
   ```
   🔍 Environment Variables Check:
   ✅ Supabase connection successful
   ✅ INSERT permissions working correctly
   ```

   **Se ver erros:**
   ```
   ❌ CRITICAL: Supabase environment variables not configured!
   ```
   → Volte para o Parte 2 e verifique se as variáveis foram adicionadas corretamente

---

## 🔧 Verificação Rápida

### Checklist de Variáveis no Netlify:

- [ ] `VITE_SUPABASE_URL` está configurada
- [ ] `VITE_SUPABASE_ANON_KEY` está configurada
- [ ] `NODE_ENV` está configurada como `production`
- [ ] Fez um novo deploy após adicionar as variáveis
- [ ] O deploy foi concluído com sucesso (status: Published)

### Como ver as variáveis no Netlify:

1. Acesse: Site configuration → Environment variables
2. Você deve ver as 3 variáveis listadas
3. Clique em cada uma para verificar o valor (Netlify esconde por padrão)

---

## 🐛 Problemas Comuns

### Problema 1: "Environment variables not configured"

**Causa**: As variáveis não foram adicionadas no Netlify ou o deploy não foi refeito

**Solução**:
1. Verifique em: Site configuration → Environment variables
2. Confirme que as 3 variáveis existem
3. Force um novo deploy: Deploys → Trigger deploy → Deploy site

---

### Problema 2: "Invalid API key"

**Causa**: A chave do Supabase está incorreta

**Solução**:
1. Volte para o painel do Supabase
2. Settings → API
3. Copie novamente a `anon public` key (NÃO a service_role)
4. Atualize a variável `VITE_SUPABASE_ANON_KEY` no Netlify
5. Force um novo deploy

---

### Problema 3: "Table does not exist"

**Causa**: O banco de dados não tem as tabelas necessárias

**Solução**:
1. Verifique no Supabase se a tabela `Funnel01` existe
2. Vá em: Table Editor no painel do Supabase
3. Se não existir, execute as migrations:
   - Acesse: SQL Editor
   - Execute os scripts em: `supabase/migrations/`

---

### Problema 4: "Permission denied" ou "RLS"

**Causa**: Row Level Security está bloqueando acesso

**Solução**:
1. No Supabase, vá em: Authentication → Policies
2. Verifique as políticas da tabela `Funnel01`
3. Deve existir uma política que permite `anon` users fazer INSERT/SELECT
4. Se não existir, as migrations devem criar automaticamente

---

## 📊 Testando a Conexão

### Teste Manual no Console do Navegador:

Abra o console (F12) e digite:

```javascript
// Verificar se as variáveis foram carregadas
console.log('URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('Key:', import.meta.env.VITE_SUPABASE_ANON_KEY)

// Se aparecer undefined, as variáveis não foram configuradas!
```

---

## 🎯 Resumo Rápido

1. **Supabase Dashboard** → Settings → API → Copiar URL e anon key
2. **Netlify Dashboard** → Site configuration → Environment variables → Adicionar:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `NODE_ENV=production`
3. **Fazer deploy** (automático via git push ou manual via Netlify)
4. **Testar** abrindo o site e verificando o console (F12)

---

## ✅ Pronto!

Seu site no Netlify agora está conectado ao Supabase e pode:
- Salvar respostas dos usuários
- Registrar analytics
- Armazenar dados dos funnels
- Gerenciar autenticação de admin

Se ainda tiver problemas, verifique os logs de deploy no Netlify:
**Deploys → [Último deploy] → Deploy log**

---

**Precisa de ajuda?** Verifique:
1. Logs de build no Netlify
2. Console do navegador (F12)
3. Variáveis de ambiente no Netlify
4. Políticas RLS no Supabase
