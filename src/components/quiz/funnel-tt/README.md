# Componentes específicos do Funnel-TT

Esta pasta contém componentes que são específicos para o funil `/funnel-tt` e que diferem dos componentes padrão do quiz.

## Estrutura

- `VideoStepTt.jsx` - Versão customizada do VideoStep para o funnel-tt
- Futuros componentes específicos do TT devem ser adicionados aqui

## Como usar

1. Duplique o componente original da pasta `src/components/quiz/`
2. Renomeie adicionando o sufixo `Tt` (ex: `ComponenteTt.jsx`)
3. Faça as modificações necessárias
4. Importe no `src/pages/funnel-tt.jsx`

## Exemplo de importação

```javascript
import VideoStepTt from "../components/quiz/funnel-tt/VideoStepTt";
import TestimonialsCarouselTt from "../components/quiz/funnel-tt/TestimonialsCarouselTt";
```

Isso mantém o código organizado e evita conflitos entre os diferentes funis.