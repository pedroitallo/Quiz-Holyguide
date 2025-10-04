# Estrutura de Componentes do Quiz

Esta pasta contém todos os componentes organizados por funil, facilitando a manutenção e escalabilidade do projeto.

## 📁 Estrutura de Pastas

```
src/components/quiz/
├── shared/              # Componentes compartilhados entre funis
│   ├── StepTracker.jsx
│   ├── NameCollection.jsx
│   ├── BirthDataCollection.jsx
│   ├── LoveSituationStep.jsx
│   ├── PalmReadingResults.jsx
│   ├── LoadingRevelation.jsx
│   ├── TestimonialsCarousel.jsx
│   ├── ThankYouStep.jsx
│   └── TypingIndicator.jsx
│
├── funnel-1/            # Componentes específicos do funnel-1
│   ├── VideoStep.jsx
│   ├── PaywallStep.jsx
│   └── SalesSection.jsx
│
├── funnel-tt/           # Componentes específicos do funnel-tt
│   ├── VideoStep.jsx
│   ├── PaywallStep.jsx
│   ├── SalesSection.jsx
│   └── README.md
│
├── funnel-vsl/          # Componentes específicos do funnel-vsl
│   └── SalesSection.jsx
│
├── funnelesp/           # Componentes específicos do funnelesp
│   ├── VideoStep.jsx
│   ├── PaywallStep.jsx
│   └── SalesSection.jsx
│
└── unused/              # Componentes não utilizados (preservados para referência)
    ├── CardSelection.jsx
    ├── LocationDetector.jsx
    ├── MysticReading.jsx
    ├── PalmReading.jsx
    ├── PersonalForm.jsx
    ├── PersonalizedPaper.jsx
    └── WelcomeMessage.jsx
```

## 🎯 Conceito de Organização

### Componentes Compartilhados (`shared/`)

Contém componentes reutilizados por múltiplos funis. Qualquer alteração aqui impacta todos os funis que usam o componente.

**Quando adicionar um componente aqui:**
- É usado por 2 ou mais funis
- Tem comportamento idêntico em todos os funis
- Não precisa de customizações específicas por funil

**Componentes atuais:**
- `StepTracker` - Rastreamento de etapas do quiz
- `NameCollection` - Coleta de nome do usuário
- `BirthDataCollection` - Coleta de data e hora de nascimento
- `LoveSituationStep` - Coleta da situação amorosa
- `PalmReadingResults` - Resultados da leitura de palma
- `LoadingRevelation` - Tela de carregamento da revelação
- `TestimonialsCarousel` - Carrossel de depoimentos
- `ThankYouStep` - Tela de agradecimento final
- `TypingIndicator` - Indicador de digitação (usado por NameCollection)

### Componentes Específicos por Funil

Cada funil tem sua pasta com componentes únicos ou personalizados.

#### **funnel-1**
Funil padrão com vídeo introdutório e paywall tradicional.

**Componentes:**
- `VideoStep` - Vídeo de introdução
- `PaywallStep` - Tela de oferta com timer
- `SalesSection` - Página de vendas

#### **funnel-tt**
Funil otimizado com variações de vídeo e CTA.

**Componentes:**
- `VideoStep` - Vídeo customizado do TikTok
- `PaywallStep` - Paywall com player customizado
- `SalesSection` - Página de vendas com layout diferenciado

#### **funnel-vsl**
Funil de vídeo de vendas longo (VSL).

**Componentes:**
- `SalesSection` - Página de vendas com VSL

#### **funnelesp**
Funil em espanhol (cópia do funnel-1 com traduções).

**Componentes:**
- `VideoStep` - Vídeo em espanhol
- `PaywallStep` - Paywall traduzido
- `SalesSection` - Página de vendas em espanhol

### Componentes Não Utilizados (`unused/`)

Componentes antigos preservados para referência futura. Não estão sendo importados por nenhum funil ativo.

## 🔧 Como Usar

### Importando Componentes Compartilhados

```javascript
// Em qualquer página de funil
import StepTracker from '../components/quiz/shared/StepTracker';
import NameCollection from '../components/quiz/shared/NameCollection';
import BirthDataCollection from '../components/quiz/shared/BirthDataCollection';
```

### Importando Componentes Específicos

```javascript
// Em src/pages/funnel-1.jsx
import VideoStep from '../components/quiz/funnel-1/VideoStep';
import PaywallStep from '../components/quiz/funnel-1/PaywallStep';

// Em src/pages/funnel-tt.jsx
import VideoStep from '../components/quiz/funnel-tt/VideoStep';
import PaywallStep from '../components/quiz/funnel-tt/PaywallStep';
```

## ✨ Benefícios da Organização

### 1. Isolamento de Mudanças
- Alterações em um funil não afetam outros
- Facilita testes A/B específicos
- Reduz risco de quebrar funcionalidades

### 2. Escalabilidade
- Fácil adicionar novos funis
- Estrutura clara para novos desenvolvedores
- Manutenção simplificada

### 3. Reutilização Inteligente
- Componentes compartilhados evitam duplicação
- Mudanças em componentes shared propagam automaticamente
- Código DRY (Don't Repeat Yourself)

### 4. Clareza de Responsabilidades
- Cada pasta tem um propósito claro
- Fácil identificar onde fazer mudanças
- Navegação intuitiva no código

## 📝 Convenções de Nomenclatura

### Componentes Específicos de Funil
- **Nome padrão:** Mesmo nome do componente compartilhado quando aplicável
  - Exemplo: `VideoStep.jsx` em vez de `VideoStepTt.jsx`
  - Facilita refatoração e reutilização

### Componentes Compartilhados
- **Nome descritivo:** Indica claramente a função
  - Exemplo: `BirthDataCollection.jsx` em vez de `Form2.jsx`

### Pastas de Funil
- **Nomenclatura:** Mesmo nome usado nas rotas
  - `funnel-1` → `/funnel-1`
  - `funnel-tt` → `/funnel-tt`
  - `funnel-vsl` → `/funnel-vsl`
  - `funnelesp` → `/funnelesp`

## 🆕 Adicionando um Novo Funil

### Passo 1: Criar Pasta
```bash
mkdir src/components/quiz/funnel-novo
```

### Passo 2: Adicionar Componentes Específicos
Copie componentes de um funil similar ou crie novos:
```bash
cp src/components/quiz/funnel-1/*.jsx src/components/quiz/funnel-novo/
```

### Passo 3: Customizar Componentes
Edite os componentes copiados com as particularidades do novo funil.

### Passo 4: Criar Página do Funil
```javascript
// src/pages/funnel-novo.jsx
import StepTracker from '../components/quiz/shared/StepTracker';
import VideoStep from '../components/quiz/funnel-novo/VideoStep';
import PaywallStep from '../components/quiz/funnel-novo/PaywallStep';
// ... outros imports compartilhados
```

### Passo 5: Adicionar Rota
```javascript
// src/App.jsx ou router config
<Route path="/funnel-novo" element={<FunnelNovoPage />} />
```

## 🔄 Convertendo Componente Compartilhado em Específico

Se um componente compartilhado precisa de customização em um funil:

1. **Copiar o componente compartilhado para a pasta do funil:**
   ```bash
   cp src/components/quiz/shared/ComponenteX.jsx src/components/quiz/funnel-1/
   ```

2. **Atualizar import na página do funil:**
   ```javascript
   // Antes
   import ComponenteX from '../components/quiz/shared/ComponenteX';

   // Depois
   import ComponenteX from '../components/quiz/funnel-1/ComponenteX';
   ```

3. **Customizar conforme necessário**

4. **Outros funis continuam usando o compartilhado**

## 🧹 Manutenção

### Componentes Unused
- Revise periodicamente se ainda são necessários
- Se não usados por 6+ meses, considere remover
- Documente motivo da remoção no commit

### Componentes Compartilhados
- Teste em todos os funis antes de alterações
- Use TypeScript/PropTypes para documentar interface
- Mantenha retrocompatibilidade quando possível

### Componentes Específicos
- Liberdade total para customização
- Documente diferenças significativas do padrão
- Considere extrair lógica comum para utils/hooks

## 📊 Métricas de Saúde da Estrutura

### ✅ Sinais de Boa Organização
- [ ] Fácil encontrar componentes
- [ ] Imports claros e concisos
- [ ] Zero duplicação desnecessária
- [ ] Novos devs navegam facilmente

### ⚠️ Sinais de Necessidade de Refatoração
- [ ] Componentes "quase iguais" em múltiplos funis
- [ ] Imports confusos ou circulares
- [ ] Dificuldade em fazer mudanças simples
- [ ] Build warnings sobre dependências

## 🎓 Perguntas Frequentes

**P: Por que não usar sufixos como `ComponenteTt`?**
R: Sufixos poluem o código e dificultam refatoração. A pasta já indica o funil, tornando sufixos redundantes.

**P: Quando devo criar um novo componente compartilhado?**
R: Quando 2+ funis precisam do MESMO comportamento. Se precisam de variações, use componentes específicos.

**P: Posso ter um componente que importa outro da mesma pasta?**
R: Sim! Componentes em uma pasta podem se importar livremente. Exemplo: `PaywallStep` importa `SalesSection` na mesma pasta.

**P: Como lidar com componentes muito similares entre funis?**
R: Considere:
1. Extrair lógica comum para um hook customizado
2. Criar um componente base compartilhado
3. Passar configurações via props
4. Aceitar pequena duplicação se simplifica o código

**P: Componentes unused devem ser testados?**
R: Não. Unused = não em produção = não precisam testes. Se voltar a usar, adicione testes então.

## 🚀 Próximos Passos de Melhoria

1. **TypeScript:** Adicionar tipagem gradual
2. **Storybook:** Documentação visual de componentes
3. **Tests:** Testes unitários para componentes compartilhados
4. **Lazy Loading:** Carregar componentes sob demanda
5. **Bundle Analysis:** Otimizar tamanho dos chunks por funil
