# Exemplos de Integração do Editor Visual

Este arquivo contém exemplos práticos de como integrar o Editor Visual em diferentes componentes.

## Exemplo 1: Texto Simples

```jsx
import { useVisualEditorContext } from '@/contexts/VisualEditorContext';
import EditableElement from '@/components/editor/EditableElement';

function SimpleText() {
  const { isEditorMode, selectedElement, setSelectedElement, getElementConfig } = useVisualEditorContext();

  return (
    <EditableElement
      elementId="my-title"
      elementType="text"
      isEditorMode={isEditorMode}
      onSelect={setSelectedElement}
      isSelected={selectedElement?.elementId === 'my-title'}
      config={getElementConfig('my-title')}
      defaultContent={{ text: 'Meu Título' }}
      defaultStyles={{
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center'
      }}
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

## Exemplo 2: Imagem com Upload

```jsx
import { useVisualEditorContext } from '@/contexts/VisualEditorContext';
import EditableElement from '@/components/editor/EditableElement';

function EditableImage() {
  const { isEditorMode, selectedElement, setSelectedElement, getElementConfig } = useVisualEditorContext();

  return (
    <EditableElement
      elementId="hero-image"
      elementType="image"
      isEditorMode={isEditorMode}
      onSelect={setSelectedElement}
      isSelected={selectedElement?.elementId === 'hero-image'}
      config={getElementConfig('hero-image')}
      defaultContent={{
        src: 'https://example.com/image.jpg',
        alt: 'Hero Image'
      }}
      defaultStyles={{
        width: '100%',
        height: 'auto',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}
    >
      {(content, styles) => (
        <img
          src={content.src}
          alt={content.alt}
          style={styles}
        />
      )}
    </EditableElement>
  );
}
```

## Exemplo 3: Botão Call-to-Action

```jsx
import { useVisualEditorContext } from '@/contexts/VisualEditorContext';
import EditableElement from '@/components/editor/EditableElement';

function CTAButton({ onClick }) {
  const { isEditorMode, selectedElement, setSelectedElement, getElementConfig } = useVisualEditorContext();

  return (
    <EditableElement
      elementId="cta-button"
      elementType="button"
      isEditorMode={isEditorMode}
      onSelect={setSelectedElement}
      isSelected={selectedElement?.elementId === 'cta-button'}
      config={getElementConfig('cta-button')}
      defaultContent={{ text: 'Começar Agora' }}
      defaultStyles={{
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        fontSize: '1.125rem',
        fontWeight: 'bold',
        padding: '16px 32px',
        borderRadius: '9999px',
        border: 'none',
        cursor: 'pointer'
      }}
    >
      {(content, styles) => (
        <button
          onClick={onClick}
          style={styles}
          className="transition-transform hover:scale-105"
        >
          {content.text}
        </button>
      )}
    </EditableElement>
  );
}
```

## Exemplo 4: Fundo de Container

```jsx
import { useVisualEditorContext } from '@/contexts/VisualEditorContext';
import EditableElement from '@/components/editor/EditableElement';

function HeroSection({ children }) {
  const { isEditorMode, selectedElement, setSelectedElement, getElementConfig } = useVisualEditorContext();

  return (
    <EditableElement
      elementId="hero-background"
      elementType="background"
      isEditorMode={isEditorMode}
      onSelect={setSelectedElement}
      isSelected={selectedElement?.elementId === 'hero-background'}
      config={getElementConfig('hero-background')}
      defaultContent={{}}
      defaultStyles={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '80px 20px',
        minHeight: '400px'
      }}
    >
      {(content, styles) => (
        <div style={styles}>
          {children}
        </div>
      )}
    </EditableElement>
  );
}
```

## Exemplo 5: Parágrafo com Formatação Rica

```jsx
import { useVisualEditorContext } from '@/contexts/VisualEditorContext';
import EditableElement from '@/components/editor/EditableElement';

function RichParagraph() {
  const { isEditorMode, selectedElement, setSelectedElement, getElementConfig } = useVisualEditorContext();

  return (
    <EditableElement
      elementId="description-text"
      elementType="text"
      isEditorMode={isEditorMode}
      onSelect={setSelectedElement}
      isSelected={selectedElement?.elementId === 'description-text'}
      config={getElementConfig('description-text')}
      defaultContent={{
        text: 'Descubra seu verdadeiro potencial e alcance seus objetivos com nosso método comprovado.'
      }}
      defaultStyles={{
        fontSize: '1.125rem',
        color: '#4b5563',
        lineHeight: '1.75',
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto'
      }}
    >
      {(content, styles) => (
        <p style={styles}>
          {content.text}
        </p>
      )}
    </EditableElement>
  );
}
```

## Exemplo 6: Card Completo Editável

```jsx
import { useVisualEditorContext } from '@/contexts/VisualEditorContext';
import EditableElement from '@/components/editor/EditableElement';

function EditableCard() {
  const { isEditorMode, selectedElement, setSelectedElement, getElementConfig } = useVisualEditorContext();

  return (
    <div className="card">
      <EditableElement
        elementId="card-image"
        elementType="image"
        isEditorMode={isEditorMode}
        onSelect={setSelectedElement}
        isSelected={selectedElement?.elementId === 'card-image'}
        config={getElementConfig('card-image')}
        defaultContent={{
          src: 'https://example.com/card-image.jpg',
          alt: 'Card Image'
        }}
        defaultStyles={{
          width: '100%',
          height: '200px',
          objectFit: 'cover'
        }}
      >
        {(content, styles) => (
          <img src={content.src} alt={content.alt} style={styles} />
        )}
      </EditableElement>

      <EditableElement
        elementId="card-title"
        elementType="text"
        isEditorMode={isEditorMode}
        onSelect={setSelectedElement}
        isSelected={selectedElement?.elementId === 'card-title'}
        config={getElementConfig('card-title')}
        defaultContent={{ text: 'Título do Card' }}
        defaultStyles={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#1f2937',
          marginTop: '16px'
        }}
      >
        {(content, styles) => (
          <h3 style={styles}>{content.text}</h3>
        )}
      </EditableElement>

      <EditableElement
        elementId="card-description"
        elementType="text"
        isEditorMode={isEditorMode}
        onSelect={setSelectedElement}
        isSelected={selectedElement?.elementId === 'card-description'}
        config={getElementConfig('card-description')}
        defaultContent={{ text: 'Descrição do card aqui.' }}
        defaultStyles={{
          fontSize: '1rem',
          color: '#6b7280',
          marginTop: '8px',
          lineHeight: '1.5'
        }}
      >
        {(content, styles) => (
          <p style={styles}>{content.text}</p>
        )}
      </EditableElement>
    </div>
  );
}
```

## Exemplo 7: Lista de Itens Editáveis

```jsx
import { useVisualEditorContext } from '@/contexts/VisualEditorContext';
import EditableElement from '@/components/editor/EditableElement';

function FeatureList() {
  const { isEditorMode, selectedElement, setSelectedElement, getElementConfig } = useVisualEditorContext();

  const features = ['feature-1', 'feature-2', 'feature-3'];

  return (
    <ul className="features-list">
      {features.map((featureId) => (
        <li key={featureId}>
          <EditableElement
            elementId={featureId}
            elementType="text"
            isEditorMode={isEditorMode}
            onSelect={setSelectedElement}
            isSelected={selectedElement?.elementId === featureId}
            config={getElementConfig(featureId)}
            defaultContent={{ text: `Feature ${featureId}` }}
            defaultStyles={{
              fontSize: '1rem',
              color: '#374151',
              padding: '8px 0'
            }}
          >
            {(content, styles) => (
              <span style={styles}>{content.text}</span>
            )}
          </EditableElement>
        </li>
      ))}
    </ul>
  );
}
```

## Exemplo 8: Wrapper de Página Completa

```jsx
import { VisualEditorProvider } from '@/contexts/VisualEditorContext';
import VisualEditorWrapper from '@/components/editor/VisualEditorWrapper';

function MyFunnelPage() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <VisualEditorProvider
      funnelId="my-funnel"
      stepSlug={`step-${currentStep}`}
    >
      <VisualEditorWrapper>
        <div className="funnel-container">
          {/* Seu conteúdo aqui */}
          {/* Todos os componentes EditableElement funcionarão automaticamente */}
        </div>
      </VisualEditorWrapper>
    </VisualEditorProvider>
  );
}
```

## Boas Práticas

### 1. IDs Únicos
Sempre use IDs únicos e descritivos:
```jsx
// ✅ Bom
elementId="hero-title-main"
elementId="pricing-card-1-title"

// ❌ Ruim
elementId="text1"
elementId="title"
```

### 2. Valores Padrão Completos
Sempre forneça valores padrão completos:
```jsx
// ✅ Bom
defaultContent={{
  text: 'Texto padrão',
  alt: 'Descrição'
}}
defaultStyles={{
  fontSize: '1rem',
  color: '#000000',
  padding: '10px'
}}

// ❌ Ruim
defaultContent={{ text: '' }}
defaultStyles={{}}
```

### 3. Estilos Inline vs Classes
Use estilos inline para propriedades editáveis:
```jsx
{(content, styles) => (
  <h1
    style={styles}  // ✅ Editável
    className="my-class"  // Classes fixas
  >
    {content.text}
  </h1>
)}
```

### 4. Composição de Componentes
Mantenha componentes pequenos e focados:
```jsx
// ✅ Bom - Componentes separados
<EditableTitle />
<EditableSubtitle />
<EditableImage />

// ❌ Ruim - Tudo em um
<EditableEverything />
```

### 5. Fallbacks
Sempre tenha fallbacks para conteúdo:
```jsx
{(content, styles) => (
  <img
    src={content.src || '/default-image.jpg'}
    alt={content.alt || 'Imagem'}
    style={styles}
  />
)}
```

## Solução de Problemas Comuns

### Elemento não fica editável
- Verifique se está dentro de `VisualEditorProvider`
- Confirme que `isEditorMode` está sendo passado
- Verifique se `elementId` é único

### Estilos não aplicam
- Use `style={styles}` no elemento renderizado
- Não sobrescreva com classes CSS importantes
- Verifique se `defaultStyles` está correto

### Salvamento não funciona
- Confirme conexão com Supabase
- Verifique políticas RLS
- Veja console do navegador para erros

## Recursos Adicionais

- Documentação completa: `VISUAL_EDITOR_GUIDE.md`
- Guia rápido: `VISUAL_EDITOR_QUICKSTART.md`
- Exemplo real: `src/components/quiz/funnel-1/VideoStep.jsx`
