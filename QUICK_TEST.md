# Teste Rápido do Sistema

## 🎯 Objetivo
Verificar se o sistema de login e rastreamento está funcionando corretamente no Vercel.

---

## ✅ Teste 1: Login do Admin (2 minutos)

### Passo 1: Acessar a página de login
```
https://seu-projeto.vercel.app/admin/login
```

### Passo 2: Inserir credenciais
- **Email:** `appyon.contact@gmail.com`
- **Senha:** `#Appyon2025!`

### Passo 3: Clicar em "Entrar"

### ✅ Resultado Esperado:
- Você deve ser **redirecionado** para `/analytics`
- Deve ver o dashboard com métricas dos funis
- Deve ver botões: "Atualizar" e "Sair"

### ❌ Se Der Erro:
- **"Failed to fetch"** → Variáveis de ambiente não configuradas no Vercel
- **"Invalid credentials"** → Senha incorreta ou usuário não existe
- **Página em branco** → Problema de build ou roteamento

---

## ✅ Teste 2: Rastreamento do Quiz (3 minutos)

### Passo 1: Abrir um funil qualquer
```
https://seu-projeto.vercel.app/funnel-1
```

### Passo 2: Abrir o Console do Navegador
- Pressione `F12` ou `Ctrl+Shift+I` (Windows/Linux)
- Pressione `Cmd+Option+I` (Mac)
- Vá na aba **Console**

### Passo 3: Navegar pelo quiz
- Clique em "Começar" ou "Continuar"
- Avance por 2-3 etapas do quiz

### ✅ Resultado Esperado:
Você deve ver mensagens no console como:
```
✓ Tracked funnel-1 - intro: true
✓ Tracked funnel-1 - video: true
✓ Tracked funnel-1 - name: true
```

### ❌ Se Não Aparecer:
- Abrir aba **Network** no DevTools
- Recarregar a página
- Procurar por erros de conexão com Supabase
- Verificar se `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão no Vercel

---

## ✅ Teste 3: Verificar Analytics (2 minutos)

### Passo 1: Fazer login no admin (se não estiver logado)

### Passo 2: Acessar o Analytics
```
https://seu-projeto.vercel.app/analytics
```

### Passo 3: Selecionar um funil
- No dropdown "Selecionar Funil", escolha: **Funnel 1**
- No dropdown "Período", escolha: **Hoje**

### Passo 4: Clicar em "Atualizar"

### ✅ Resultado Esperado:
- Deve ver métricas:
  - **Total de Sessões:** Número maior que 0
  - **Start Quiz:** Quantas pessoas iniciaram
  - **End Quiz:** Quantas pessoas completaram
  - **Retenção:** Percentual de conclusão
- Deve ver o funil de conversão com as etapas

### ❌ Se Não Aparecer Dados:
- Verificar se o funil selecionado tem dados (ex: Funnel 1 tem 11,362 sessões)
- Tentar selecionar "Todo período" ao invés de "Hoje"
- Verificar se a conexão com Supabase está OK

---

## 🔧 Teste 4: Verificar Variáveis de Ambiente (1 minuto)

### No Vercel:
1. Ir em **Settings** → **Environment Variables**
2. Verificar se existem estas 5 variáveis:
   - ✅ `VITE_SUPABASE_URL`
   - ✅ `VITE_SUPABASE_ANON_KEY`
   - ✅ `VITE_BASE44_APP_ID`
   - ✅ `VITE_BASE44_API_URL`
   - ✅ `VITE_BASE44_FILES_URL`

### Se Alguma Estiver Faltando:
1. Adicionar a variável
2. Fazer **Redeploy** do projeto
3. Aguardar 2-3 minutos
4. Testar novamente

---

## 📊 Resumo dos Testes

| Teste | Status | Tempo |
|-------|--------|-------|
| Login do Admin | ⬜ | 2 min |
| Rastreamento do Quiz | ⬜ | 3 min |
| Verificar Analytics | ⬜ | 2 min |
| Variáveis de Ambiente | ⬜ | 1 min |
| **TOTAL** | - | **8 min** |

---

## 🎉 Se Todos os Testes Passaram

**Parabéns!** Seu sistema está 100% operacional:

✅ Login funcionando
✅ Rastreamento funcionando
✅ Analytics funcionando
✅ Banco de dados conectado
✅ Edge Functions operacionais

---

## ❌ Se Algum Teste Falhou

### Problema: "Failed to fetch" no Login

**Solução Rápida:**
```bash
# 1. Verificar se Edge Function está ativa
https://reoszoosrzwlrzkasube.supabase.co/functions/v1/admin-login

# 2. Adicionar variáveis no Vercel
VITE_SUPABASE_URL=https://reoszoosrzwlrzkasube.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci... (valor completo)

# 3. Redeploy no Vercel
```

### Problema: Rastreamento não funciona

**Solução Rápida:**
1. Abrir console do navegador (F12)
2. Procurar por erros de Supabase
3. Verificar se tabela `step_views_funnel_1` existe
4. Adicionar variáveis de ambiente no Vercel
5. Redeploy

### Problema: Analytics vazio

**Solução Rápida:**
1. Selecionar um funil que tem dados (ex: Funnel 1)
2. Selecionar "Todo período" ao invés de "Hoje"
3. Clicar em "Atualizar"
4. Se continuar vazio, verificar conexão com Supabase

---

## 📞 Suporte

Se após seguir todos os passos ainda houver problemas:

1. Verificar arquivo: `SYSTEM_STATUS.md` (status completo do sistema)
2. Verificar arquivo: `VERCEL_CONFIG_GUIDE.md` (guia de configuração)
3. Verificar logs do Vercel: Deployments → Build Logs
4. Verificar logs do Supabase: Dashboard → Logs

---

## 🚀 Próximos Passos

Após confirmar que tudo está funcionando:

1. [ ] Configurar domínio customizado no Vercel (opcional)
2. [ ] Criar novos usuários admin (se necessário)
3. [ ] Criar novos funis
4. [ ] Configurar testes A/B
5. [ ] Monitorar métricas diariamente

---

**Tempo Total de Teste:** ~8 minutos
**Dificuldade:** Fácil
**Pré-requisitos:** Acesso ao Vercel + Credenciais do Admin
