import { useDroppable } from '@dnd-kit/core';
import { Trash2, Copy, MoveVertical } from 'lucide-react';

export default function BuilderPreview({
  step,
  viewMode,
  selectedElement,
  onElementSelect,
  onElementUpdate,
  onElementDelete
}) {
  const { setNodeRef } = useDroppable({
    id: 'canvas-drop-zone'
  });

  const config = step?.config || {};
  const elements = config.elements || [];

  const containerClasses = viewMode === 'mobile'
    ? 'w-[375px] h-[667px]'
    : 'w-full max-w-4xl h-full';

  return (
    <div className="flex-1 bg-gray-100 overflow-auto flex items-center justify-center p-8">
      <div
        className={`${containerClasses} bg-white rounded-lg shadow-2xl overflow-auto transition-all duration-300`}
        style={{
          border: viewMode === 'mobile' ? '8px solid #1f2937' : 'none',
          borderRadius: viewMode === 'mobile' ? '36px' : '8px'
        }}
      >
        <div
          ref={setNodeRef}
          className="h-full p-6 overflow-y-auto"
          style={{ minHeight: '400px' }}
        >
          {step ? (
            <>
              {elements.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-sm mb-2">Arraste componentes aqui</p>
                  <p className="text-xs">ou adicione elementos pelo painel lateral</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {elements.map((element) => (
                    <PreviewElement
                      key={element.id}
                      element={element}
                      isSelected={selectedElement?.id === element.id}
                      onSelect={() => onElementSelect(element)}
                      onUpdate={(updates) => onElementUpdate(element.id, updates)}
                      onDelete={() => onElementDelete(element.id)}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              Selecione uma página para começar
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PreviewElement({ element, isSelected, onSelect, onUpdate, onDelete }) {
  const renderElement = () => {
    const props = element.props || {};

    switch (element.type) {
      case 'heading':
        const HeadingTag = props.level || 'h1';
        return (
          <HeadingTag
            className={`font-bold ${
              props.level === 'h1' ? 'text-3xl' :
              props.level === 'h2' ? 'text-2xl' :
              'text-xl'
            }`}
            style={{ textAlign: props.alignment || 'center' }}
          >
            {props.text || 'Título'}
          </HeadingTag>
        );

      case 'text':
        return (
          <p
            className="text-gray-700"
            style={{ textAlign: props.alignment || 'center' }}
          >
            {props.text || 'Texto'}
          </p>
        );

      case 'button':
        return (
          <button
            className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
              props.style === 'primary'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
          >
            {props.text || 'Botão'}
          </button>
        );

      case 'input':
        return (
          <input
            type={props.type || 'text'}
            placeholder={props.placeholder || 'Digite aqui...'}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            disabled
          />
        );

      case 'checkbox':
        return (
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-5 h-5 rounded border-gray-300" disabled />
            <span className="text-gray-700">{props.label || 'Opção'}</span>
          </label>
        );

      case 'radio':
        return (
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="radio" className="w-5 h-5 border-gray-300" disabled />
            <span className="text-gray-700">{props.label || 'Opção'}</span>
          </label>
        );

      case 'image':
        return (
          <div className="w-full bg-gray-100 rounded-lg overflow-hidden" style={{ width: props.width }}>
            {props.src ? (
              <img src={props.src} alt={props.alt || 'Imagem'} className="w-full h-auto" />
            ) : (
              <div className="aspect-video flex items-center justify-center text-gray-400">
                Imagem
              </div>
            )}
          </div>
        );

      case 'video':
        return (
          <div className="w-full aspect-video bg-gray-900 rounded-lg flex items-center justify-center text-white">
            {props.url ? '▶ Vídeo' : 'URL do vídeo'}
          </div>
        );

      case 'divider':
        return (
          <hr
            className="w-full"
            style={{
              borderStyle: props.style || 'solid',
              borderColor: props.color || '#e5e7eb',
              borderWidth: '1px 0 0 0'
            }}
          />
        );

      default:
        return <div className="text-gray-400">Componente desconhecido</div>;
    }
  };

  return (
    <div
      className={`relative group ${isSelected ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {renderElement()}

      {isSelected && (
        <div className="absolute -top-10 right-0 flex gap-1 bg-blue-600 text-white rounded-md shadow-lg p-1 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 hover:bg-blue-700 rounded transition-colors"
            title="Deletar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 hover:bg-blue-700 rounded transition-colors"
            title="Duplicar"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 hover:bg-blue-700 rounded cursor-move"
            title="Mover"
          >
            <MoveVertical className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
