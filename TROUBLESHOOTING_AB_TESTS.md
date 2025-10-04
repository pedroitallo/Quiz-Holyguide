# Troubleshooting - Testes A/B Mostrando Dados Antigos

## Problema Reportado
Ao criar um teste A/B, o dashboard está mostrando dados antigos do funil em vez de começar com dados zerados.

## Logs de Debug Adicionados

Foram adicionados logs detalhados para diagnosticar o problema:

### No Console do Navegador

Quando você acessar `/admin/analytics-ab`, verá logs como:

```
🔍 Loading test stats for: Nome do Teste Test ID: f3354d5d-...
📅 Date filter: {start: "2025-10-04T20:48:44.154Z", end: "2025-10-04T..."}

🔎 Fetching analytics for funnel-1 (table: step_views_funnel_1)
   AB Test ID: f3354d5d-f517-44e4-95b6-49279841c810
   Date filter: {start: "2025-10-04T20:48:44.154Z", end: "..."}
   ✓ Filtering by ab_test_id = f3354d5d-f517-44e4-95b6-49279841c810
   📦 First batch returned 0 records
   ✅ Total records fetched: 0

📊 Control analytics: {totalSessions: 0, startQuiz: 0, endQuiz: 0, ...}
```

## Cenários Possíveis

### ✅ CENÁRIO 1: Funcionando Corretamente (Dados Zerados)

**Logs esperados:**
```
📦 First batch returned 0 records
✅ Total records fetched: 0
📊 Control analytics: {totalSessions: 0, ...}
```

**Dashboard mostra:**
- Total de Visitantes: 0
- Start Quiz: 0
- Paywall: 0
- Todos os steps com count: 0

**Ação:** Nenhuma! Sistema está funcionando perfeitamente. ✅

---

### ❌ CENÁRIO 2: Pegando Dados Antigos SEM ab_test_id

**Logs suspeitos:**
```
📦 First batch returned 150 records  ⚠️
✅ Total records fetched: 150
📊 Control analytics: {totalSessions: 150, ...}
```

**Possível causa:** Query está ignorando o filtro `ab_test_id`

**Verificação no banco:**
```sql
-- Executar no Supabase SQL Editor
SELECT COUNT(*) as total,
       COUNT(CASE WHEN ab_test_id IS NULL THEN 1 END) as sem_test_id,
       COUNT(CASE WHEN ab_test_id IS NOT NULL THEN 1 END) as com_test_id
FROM step_views_funnel_1;
```

**Ação:**
1. Verificar se a migration foi aplicada corretamente
2. Confirmar que coluna `ab_test_id` existe em todas as tabelas

---

### ❌ CENÁRIO 3: Não Filtrando por ab_test_id

**Logs suspeitos:**
```
AB Test ID: NONE (all data)  ⚠️
```

**Causa:** O `ab_test_id` não está sendo passado para a função

**Ação:**
1. Verificar se `test.id` existe: `console.log('Test object:', test)`
2. Confirmar que `loadTestStats` está recebendo o objeto completo do teste

---

### ❌ CENÁRIO 4: Cache do Navegador

**Sintomas:**
- Logs mostram 0 records
- Dashboard ainda mostra números antigos

**Causa:** React não está re-renderizando ou dados em cache

**Ação:**
1. Forçar refresh: Ctrl+Shift+R (ou Cmd+Shift+R no Mac)
2. Limpar cache do navegador
3. Verificar se `setControlStats` e `setTestStats` estão sendo chamados

---

## Diagnóstico Passo a Passo

### Passo 1: Verificar Banco de Dados

```sql
-- Confirmar que teste existe
SELECT * FROM ab_tests WHERE status = 'active';

-- Verificar registros vinculados ao teste
SELECT
  'funnel_1' as table_name,
  COUNT(*) as records
FROM step_views_funnel_1
WHERE ab_test_id = 'SEU-TEST-ID-AQUI'

UNION ALL

SELECT
  'funnel_tt' as table_name,
  COUNT(*) as records
FROM step_views_funnel_tt
WHERE ab_test_id = 'SEU-TEST-ID-AQUI';
```

**Resultado esperado:** 0 records em todas as tabelas

---

### Passo 2: Verificar Console do Navegador

1. Abrir DevTools (F12)
2. Ir para aba Console
3. Acessar `/admin/analytics-ab`
4. Procurar pelos logs com emojis (🔍, 📊, etc.)

**Verificar:**
- [ ] `AB Test ID` está preenchido (não é "NONE")
- [ ] `Total records fetched: 0`
- [ ] `totalSessions: 0`

---

### Passo 3: Verificar Tracking Ativo

**Abrir um funil em uma aba anônima:**
```
https://seu-dominio.com/funnel-1
```

**No console, verificar:**
```
✓ Active A/B test found for funnel-1: f3354d5d-...
✓ Created tracking for funnel-1 - video: true (Test: f3354d5d-...)
```

**Verificar sessionStorage:**
```javascript
// No console do navegador
sessionStorage.getItem('ab_test_id')
// Deve retornar o UUID do teste
```

---

### Passo 4: Confirmar Dados Estão Sendo Coletados

Após visitar algumas etapas do funil:

```sql
-- Verificar se dados estão sendo criados com ab_test_id
SELECT
  session_id,
  ab_test_id,
  video,
  testimonials,
  name,
  viewed_at
FROM step_views_funnel_1
WHERE ab_test_id = 'SEU-TEST-ID-AQUI'
ORDER BY viewed_at DESC
LIMIT 10;
```

**Resultado esperado:** Registros com `ab_test_id` preenchido

---

## Soluções Rápidas

### Solução 1: Resetar Dados do Teste

Se houver dados incorretos vinculados ao teste:

1. Ir para `/admin/analytics-ab`
2. Clicar em "Testes A/B"
3. Na aba "Gestão", clicar no botão laranja de reset (ícone ↻)
4. Confirmar

### Solução 2: Forçar Refresh Completo

```javascript
// No console do navegador
sessionStorage.clear()
localStorage.clear()
location.reload(true)
```

### Solução 3: Recriar o Teste

Se nada funcionar:

1. Excluir o teste atual
2. Criar novo teste com os mesmos funis
3. O novo UUID forçará isolamento limpo

---

## Verificação Final - Sistema Funcionando

**Indicadores de sucesso:**

✅ Teste recém-criado mostra 0 visitantes
✅ Após visitar funil, contador aumenta
✅ Dados históricos do funil permanecem separados
✅ Resetar teste volta contador para 0
✅ Logs mostram `ab_test_id` correto

**Teste completo:**

1. Criar novo teste A/B
2. Dashboard mostra 0 visitantes ✅
3. Visitar funil em aba anônima (3-4 steps)
4. Voltar ao dashboard
5. Dashboard mostra 1 visitante ✅
6. Resetar dados do teste
7. Dashboard volta para 0 visitantes ✅

---

## Informações Técnicas

### Query Exata que Está Sendo Executada

```javascript
supabase
  .from('step_views_funnel_1')
  .select('*')
  .eq('ab_test_id', 'f3354d5d-f517-44e4-95b6-49279841c810')
  .gte('viewed_at', '2025-10-04T20:48:44.154Z')
  .lte('viewed_at', '2025-10-04T21:00:00.000Z')
```

Esta query:
- ✅ Filtra por `ab_test_id` específico
- ✅ Aplica filtro de data do teste
- ✅ Ignora completamente dados históricos (`ab_test_id = NULL`)

### Dados Que NUNCA Aparecem no Teste

- ❌ Registros com `ab_test_id = NULL` (dados históricos)
- ❌ Registros com `ab_test_id` de outro teste
- ❌ Registros antes de `start_date` do teste
- ❌ Registros depois de `end_date` do teste (se definido)

---

## Contato para Suporte

Se após todas as verificações o problema persistir:

**Fornecer:**
1. Screenshot do console com os logs
2. ID do teste ativo (da URL ou da query SQL)
3. Resultado da query de contagem de registros
4. Screenshot do dashboard mostrando os números

**Logs essenciais:**
```
🔍 Loading test stats for: ...
   AB Test ID: ... (deve estar preenchido!)
   📦 First batch returned X records (deve ser 0 para teste novo!)
   ✅ Total records fetched: X
```
