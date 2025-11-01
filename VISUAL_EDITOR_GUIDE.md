# Guia do Editor Visual de Quizzes

## Visão Geral

O Editor Visual permite que administradores editem elementos do quiz diretamente na página de preview, sem precisar tocar em código. Todas as alterações são salvas automaticamente no banco de dados Supabase e podem ser publicadas quando estiverem prontas.

## Estrutura do Sistema

### Componentes Principais

1. **EditableElement** (`src/components/editor/EditableElement.jsx`)
   - Wrapper que torna qualquer elemento editável
   - Mostra highlight ao passar o mouse
   - Gerencia seleção de elementos

2. **VisualEditorWrapper** (`src/components/editor/VisualEditorWrapper.jsx`)
   - Container principal que envolve todo o funil
   - Gerencia estado global do editor
   - Controla toolbar e painel de propriedades

3. **EditorToolbar** (`src/components/editor/EditorToolbar.jsx`)
   - Botão flutuante para ativar/desativar modo edição
   - Mostra status de salvamento
   - Botão para publicar todas as alterações

4. **PropertiesPanel** (`src/components/editor/PropertiesPanel.jsx`)
   - Painel lateral para editar propriedades do elemento selecionado
   - Abas para conteúdo, estilos e histórico
   - Suporte para upload de imagens e áudios

### Hooks e Contextos

- **useVisualEditor** (`src/hooks/useVisualEditor.js`)
  - Hook customizado para gerenciar estado do editor
  - Auto-save com debounce de 1 segundo
  - Funções para carregar, atualizar e publicar configurações

- **VisualEditorContext** (`src/contexts/VisualEditorContext.jsx`)
  - Contexto global para compartilhar estado do editor
  - Verifica autenticação de administrador
  - Fornece acesso ao hook useVisualEditor

### Banco de Dados

Duas tabelas principais no Supabase:

1. **step_element_configs**
   - Armazena configurações de cada elemento editável
   - Campos: funnel_id, step_slug, element_id, element_type, content, css_overrides, version, is_published

2. **step_element_config_history**
   - Histórico completo de todas as alterações
   - Permite reverter para versões anteriores

## Como Usar

### 1. Integrar em um Funil

Envolva o funil com os componentes do editor:

```jsx
import { VisualEditorProvider } from '../contexts/VisualEditorContext';
import VisualEditorWrapper from '../components/editor/VisualEditorWrapper';

export default function FunnelPage() {
  return (
    <VisualEditorProvider funnelId="funnel-1" stepSlug="step-1">
      <VisualEditorWrapper>
        {/* Seu conteúdo do funil aqui */}
      </VisualEditorWrapper>
    </VisualEditorProvider>
  );
}
```

**IMPORTANTE**: O `funnelId` deve ser o **slug do funil** (ex: "funnel-1"), não o UUID. O sistema busca automaticamente o UUID correspondente no banco de dados da tabela `funnels`.

### 2. Tornar Elementos Editáveis

Use o componente `EditableElement` para envolver qualquer elemento:

```jsx
import { useVisualEditorContext } from '@/contexts/VisualEditorContext';
import EditableElement from '@/components/editor/EditableElement';

function MyComponent() {
  const { isEditorMode, selectedElement, setSelectedElement, getElementConfig } = useVisualEditorContext();

  return (
    <EditableElement
      elementId="unique-element-id"
      elementType="text" // ou 'image', 'audio', 'button', 'background'
      isEditorMode={isEditorMode}
      onSelect={setSelectedElement}
      isSelected={selectedElement?.elementId === 'unique-element-id'}
      config={getElementConfig('unique-element-id')}
      defaultContent={{ text: 'Texto padrão' }}
      defaultStyles={{ fontSize: '1rem', color: '#000000' }}
    >
      {(content, styles) => (
        <h1 style={styles}>
          {content.text}
        </h1>
      )}
    </EditableElement>
  );
}
```

### 3. Tipos de Elementos Suportados

#### Texto
```jsx
defaultContent={{ text: 'Meu texto' }}
defaultStyles={{
  fontSize: '1rem',
  color: '#000000',
  fontWeight: 'normal',
  textAlign: 'center'
}}
```

#### Imagem
```jsx
defaultContent={{
  src: 'https://...',
  alt: 'Descrição'
}}
defaultStyles={{
  width: '100%',
  height: 'auto',
  borderRadius: '8px'
}}
```

#### Botão
```jsx
defaultContent={{ text: 'Clique aqui' }}
defaultStyles={{
  backgroundColor: '#3b82f6',
  color: '#ffffff',
  padding: '12px 24px',
  borderRadius: '8px'
}}
```

#### Áudio
```jsx
defaultContent={{
  src: 'https://...',
  autoplay: false,
  loop: false
}}
```

#### Background
```jsx
defaultContent={{
  backgroundImage: 'url(https://...)'
}}
defaultStyles={{
  backgroundColor: '#ffffff',
  background: 'linear-gradient(...)'
}}
```

## Fluxo de Trabalho

1. **Login como Admin**
   - Faça login no painel administrativo (`/admin/login`)
   - Token de autenticação é salvo no localStorage

2. **Acessar Funil em Preview**
   - Navegue até a URL do funil (ex: `/funnel-1`)
   - Botão "Modo Edição" aparece no canto inferior direito

3. **Ativar Modo Edição**
   - Clique no botão "Modo Edição"
   - Ou pressione `Ctrl+E` / `Cmd+E`

4. **Editar Elementos**
   - Passe o mouse sobre elementos para ver highlight
   - Clique no elemento para selecioná-lo
   - Painel de propriedades aparece à esquerda
   - Faça suas alterações (texto, cor, tamanho, etc)
   - Alterações são salvas automaticamente após 1 segundo

5. **Upload de Arquivos**
   - Para imagens e áudios, use o botão "Upload"
   - Arquivos são enviados para Supabase Storage
   - URL é automaticamente preenchida

6. **Revisar Histórico**
   - Clique na aba "Histórico" no painel de propriedades
   - Veja todas as versões anteriores
   - Clique em "Restaurar" para voltar a uma versão

7. **Publicar Alterações**
   - Alterações não publicadas são marcadas como rascunho
   - Clique em "Publicar Tudo" no toolbar
   - Alterações ficam visíveis para todos os usuários

8. **Desativar Modo Edição**
   - Clique no X no toolbar
   - Ou pressione `Ctrl+E` / `Cmd+E` novamente

## Atalhos de Teclado

- `Ctrl+E` / `Cmd+E` - Ativar/desativar modo edição
- `Escape` - Desselecionar elemento atual

## Recursos Avançados

### Estilos CSS Customizados

No painel de propriedades, aba "Estilo", você pode definir:
- Margem (margin)
- Padding
- Borda (border)
- Sombra (boxShadow)
- Opacidade (opacity)

### Versionamento

- Cada alteração incrementa o número da versão
- Histórico completo é mantido na tabela `step_element_config_history`
- Você pode reverter para qualquer versão anterior

### Status de Publicação

- `is_published: false` - Alterações visíveis apenas no modo edição
- `is_published: true` - Alterações visíveis para todos os usuários
- Permite testar mudanças antes de publicar

## Segurança

- RLS (Row Level Security) ativo em todas as tabelas
- Apenas admins autenticados podem editar
- Usuários anônimos só veem configs publicadas
- Token JWT verificado no frontend

## Exemplo Completo

Veja `src/components/quiz/funnel-1/VideoStep.jsx` para um exemplo completo de como implementar elementos editáveis.

## Próximos Passos

Para adicionar o editor em outros funis:

1. Adicione `VisualEditorProvider` e `VisualEditorWrapper` no componente do funil
2. Envolva elementos com `EditableElement`
3. Configure `elementId` único para cada elemento
4. Defina `defaultContent` e `defaultStyles` apropriados
5. Teste no modo edição

## Troubleshooting

### Botão "Modo Edição" não aparece
- Verifique se você está autenticado como admin
- Token deve estar em `localStorage.getItem('admin_token')`

### Alterações não são salvas
- Verifique console do navegador para erros
- Confirme que variáveis de ambiente do Supabase estão configuradas
- Verifique RLS policies no banco de dados

### Elemento não é selecionável
- Verifique se `elementId` é único
- Confirme que `isEditorMode` está sendo passado corretamente
- Verifique se `onSelect` está conectado

## Contribuindo

Para adicionar novos tipos de elementos editáveis:

1. Adicione o tipo em `element_type` no schema do banco
2. Crie renderizador específico em `PropertiesPanel.jsx`
3. Adicione exemplo de uso na documentação
