# 📦 Funnel-2 - Pacote Completo

## 📋 Conteúdo do Pacote

Este pacote contém TODOS os arquivos necessários para rodar o funnel-2 em outro projeto.

### Estrutura de Arquivos:

```
funnel-2-export/
├── src/
│   ├── pages/
│   │   └── funnel-2.jsx                      ← Página principal
│   ├── components/
│   │   └── quiz/
│   │       ├── funnel-2/                     ← 12 componentes específicos
│   │       │   ├── InitiateQuiz.jsx
│   │       │   ├── BirthDateWithZodiac.jsx
│   │       │   ├── IdealPartnerQualities.jsx
│   │       │   ├── PartnerPreference.jsx
│   │       │   ├── BirthChartResults.jsx
│   │       │   ├── LoveChallenge.jsx
│   │       │   ├── LoveDesire.jsx
│   │       │   ├── SoulmateConnection.jsx
│   │       │   ├── LoveLanguage.jsx
│   │       │   ├── RelationshipEnergy.jsx
│   │       │   ├── FutureScenario.jsx
│   │       │   └── SoulmateDrawingLoading.jsx
│   │       ├── shared/                        ← 5 componentes compartilhados
│   │       │   ├── StepTracker.jsx
│   │       │   ├── TestimonialsCarousel.jsx
│   │       │   ├── LoveSituationStep.jsx
│   │       │   ├── LoadingRevelation.jsx
│   │       │   └── ThankYouStep.jsx
│   │       └── funnel-1/
│   │           └── PaywallStep.jsx            ← Usado pelo funnel-2
│   ├── entities/                              ← Sistema de dados
│   │   ├── HybridQuizResult.js               ← Principal
│   │   ├── SupabaseQuizResult.js
│   │   └── QuizResult.js
│   ├── hooks/
│   │   └── useTracking.js                    ← Hook de tracking
│   ├── utils/
│   │   └── stepTracking.js                   ← Analytics de steps
│   └── lib/
│       └── supabase.js                        ← Cliente Supabase
├── supabase/
│   └── migrations/                            ← 4 migrations SQL
│       ├── 20250826224030_teal_base.sql
│       ├── 20251022164618_create_funnel_2_step_views_table.sql
│       ├── 20251028123056_fix_funnel_2_table_structure.sql
│       └── 20251028123900_add_anon_select_policy_funnel_2.sql
└── env.example                                ← Configuração de ambiente
```

---

## 🚀 INSTALAÇÃO

### 1. Extrair os Arquivos
```bash
tar -xzf funnel-2-complete.tar.gz
```

### 2. Copiar para Seu Projeto
```bash
# Copie toda a estrutura src/ para o seu projeto
cp -r funnel-2-export/src/* seu-projeto/src/

# Copie as migrations
cp -r funnel-2-export/supabase/* seu-projeto/supabase/
```

### 3. Instalar Dependências
```bash
npm install framer-motion lucide-react @supabase/supabase-js
```

### 4. Configurar Variáveis de Ambiente

Crie ou edite o arquivo `.env` na raiz do seu projeto:

```bash
VITE_Bolt_Database_URL=https://seu-projeto.supabase.co
VITE_Bolt_Database_ANON_KEY=sua-chave-anon-aqui
```

**Onde encontrar essas chaves:**
1. Acesse seu projeto no Supabase Dashboard
2. Vá em Settings → API
3. Copie a "Project URL" e a "anon public key"

### 5. Rodar as Migrations no Supabase

**Opção A - Via Dashboard:**
1. Acesse o Supabase Dashboard
2. Vá em SQL Editor
3. Copie e execute cada migration na ordem:
   - `20250826224030_teal_base.sql`
   - `20251022164618_create_funnel_2_step_views_table.sql`
   - `20251028123056_fix_funnel_2_table_structure.sql`
   - `20251028123900_add_anon_select_policy_funnel_2.sql`

**Opção B - Via CLI:**
```bash
supabase db push
```

### 6. Adicionar Rota no Router

No seu arquivo de rotas (ex: `App.jsx` ou `main.jsx`):

```jsx
import Funnel2 from './pages/funnel-2'

// Adicione a rota:
<Route path="/funnel-2" element={<Funnel2 />} />
```

### 7. Testar o Funnel

Acesse: `http://localhost:5173/funnel-2`

---

## 📦 DEPENDÊNCIAS NECESSÁRIAS

```json
{
  "dependencies": {
    "framer-motion": "^12.4.7",
    "lucide-react": "^0.475.0",
    "@supabase/supabase-js": "^2.56.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

---

## 🗄️ ESTRUTURA DO BANCO DE DADOS

### Tabelas Criadas:

1. **Funnel01** - Armazena resultados do quiz
2. **step_views_funnel_2** - Rastreia visualizações de cada step

### Dados Salvos:
- UTM parameters (source, medium, campaign)
- Respostas do quiz
- Tracking de progresso
- Testes A/B (se configurados)

---

## 🔧 TROUBLESHOOTING

### Erro: "Supabase client not initialized"
- Verifique se as variáveis de ambiente estão configuradas corretamente no `.env`
- Reinicie o servidor de desenvolvimento após criar o `.env`

### Erro: "relation does not exist"
- Execute todas as migrations SQL no Supabase
- Verifique se as tabelas foram criadas no Dashboard

### Erro: "RLS policy"
- As migrations já incluem as políticas RLS necessárias
- Verifique no Dashboard em Authentication → Policies

### Componentes não encontrados:
- Certifique-se de ter copiado TODA a estrutura de pastas
- Verifique se os paths de import estão corretos (use `@/` ou paths relativos)

---

## 📊 FLUXO DO FUNNEL-2

1. **InitiateQuiz** - Tela inicial
2. **TestimonialsCarousel** - Depoimentos
3. **BirthDateWithZodiac** - Coleta data de nascimento
4. **LoveSituationStep** - Situação amorosa
5. **IdealPartnerQualities** - Qualidades ideais
6. **PartnerPreference** - Preferências de parceiro
7. **BirthChartResults** - Resultados do mapa astral
8. **LoveChallenge** - Desafios no amor
9. **LoveDesire** - Desejos amorosos
10. **SoulmateConnection** - Conexão com alma gêmea
11. **LoveLanguage** - Linguagem do amor
12. **RelationshipEnergy** - Energia de relacionamento
13. **FutureScenario** - Cenário futuro
14. **LoadingRevelation** - Carregamento
15. **PaywallStep** - Página de pagamento
16. **ThankYouStep** - Agradecimento

---

## 📞 SUPORTE

Se encontrar problemas, verifique:
1. Console do navegador (F12) para erros JavaScript
2. Network tab para erros de API do Supabase
3. Supabase Logs no Dashboard

---

## ✅ CHECKLIST DE INSTALAÇÃO

- [ ] Arquivos copiados para o projeto
- [ ] Dependências instaladas (`npm install`)
- [ ] Arquivo `.env` configurado
- [ ] Migrations executadas no Supabase
- [ ] Rota adicionada no router
- [ ] Servidor reiniciado
- [ ] Funnel testado e funcionando

---

**Versão:** 1.0.0
**Última atualização:** 2025-12-24
