# 📦 Funnel-1 - Pacote Completo

## 📋 Conteúdo do Pacote

Este pacote contém TODOS os arquivos necessários para rodar o funnel-1 em outro projeto.

### Estrutura de Arquivos:

```
funnel-1-export/
├── src/
│   ├── pages/
│   │   └── funnel-1.jsx                      ← Página principal
│   ├── components/
│   │   └── quiz/
│   │       ├── funnel-1/                     ← 3 componentes específicos
│   │       │   ├── VideoStep.jsx
│   │       │   ├── SalesSection.jsx
│   │       │   └── PaywallStep.jsx
│   │       └── shared/                        ← Componentes compartilhados
│   │           ├── StepTracker.jsx
│   │           ├── TestimonialsCarousel.jsx
│   │           ├── LoveSituationStep.jsx
│   │           ├── NameCollection.jsx
│   │           ├── BirthDataCollection.jsx
│   │           ├── LoadingRevelation.jsx
│   │           ├── PalmReadingResults.jsx
│   │           ├── ThankYouStep.jsx
│   │           └── TypingIndicator.jsx
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
│   └── migrations/                            ← Migration SQL
│       └── 20250826224030_teal_base.sql
└── env.example                                ← Configuração de ambiente
```

---

## 🚀 INSTALAÇÃO

### 1. Extrair os Arquivos
```bash
tar -xzf funnel-1-complete.tar.gz
```

### 2. Copiar para Seu Projeto
```bash
# Copie toda a estrutura src/ para o seu projeto
cp -r funnel-1-export/src/* seu-projeto/src/

# Copie as migrations
cp -r funnel-1-export/supabase/* seu-projeto/supabase/
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
3. Copie e execute a migration:
   - `20250826224030_teal_base.sql`

**Opção B - Via CLI:**
```bash
supabase db push
```

### 6. Adicionar Rota no Router

No seu arquivo de rotas (ex: `App.jsx` ou `main.jsx`):

```jsx
import Funnel1 from './pages/funnel-1'

// Adicione a rota:
<Route path="/funnel-1" element={<Funnel1 />} />
```

### 7. Testar o Funnel

Acesse: `http://localhost:5173/funnel-1`

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

### Dados Salvos:
- UTM parameters (source, medium, campaign)
- Respostas do quiz (nome, data de nascimento, etc.)
- Tracking de progresso
- Testes A/B (se configurados)

---

## 🔧 TROUBLESHOOTING

### Erro: "Supabase client not initialized"
- Verifique se as variáveis de ambiente estão configuradas corretamente no `.env`
- Reinicie o servidor de desenvolvimento após criar o `.env`

### Erro: "relation does not exist"
- Execute a migration SQL no Supabase
- Verifique se a tabela Funnel01 foi criada no Dashboard

### Erro: "RLS policy"
- A migration já inclui as políticas RLS necessárias
- Verifique no Dashboard em Authentication → Policies

### Componentes não encontrados:
- Certifique-se de ter copiado TODA a estrutura de pastas
- Verifique se os paths de import estão corretos

---

## 📊 FLUXO DO FUNNEL-1

1. **LoveSituationStep** - Situação amorosa atual
2. **NameCollection** - Coleta de nome
3. **BirthDataCollection** - Coleta data de nascimento
4. **LoadingRevelation** - Carregamento da leitura
5. **PalmReadingResults** - Resultados da leitura de palma
6. **VideoStep** - Vídeo de vendas (VSL)
7. **SalesSection** - Seção de vendas
8. **PaywallStep** - Página de pagamento
9. **ThankYouStep** - Agradecimento

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
