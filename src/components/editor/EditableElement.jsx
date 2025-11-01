import React, { useEffect, useState, useRef } from 'react';
import { Edit2 } from 'lucide-react';

export default function EditableElement({
  elementId,
  elementType,
  children,
  defaultContent,
  defaultStyles = {},
  isEditorMode,
  onSelect,
  isSelected,
  config
}) {
  const [isHovered, setIsHovered] = useState(false);
  const elementRef = useRef(null);

  const appliedContent = config?.content || defaultContent;
  const appliedStyles = {
    ...defaultStyles,
    ...(config?.css_overrides || {})
  };

  const handleClick = (e) => {
    if (isEditorMode) {
      e.stopPropagation();
      onSelect({
        elementId,
        elementType,
        element: elementRef.current,
        content: appliedContent,
        styles: appliedStyles
      });
    }
  };

  const renderContent = () => {
    if (typeof children === 'function') {
      return children(appliedContent, appliedStyles);
    }
    return children;
  };

  const editorStyles = isEditorMode ? {
    cursor: 'pointer',
    position: 'relative',
    outline: isSelected
      ? '2px solid #3b82f6'
      : isHovered
        ? '2px dashed #93c5fd'
        : 'none',
    outlineOffset: '2px',
    transition: 'outline 0.2s ease'
  } : {};

  return (
    <div
      ref={elementRef}
      data-element-id={elementId}
      data-element-type={elementType}
      onClick={handleClick}
      onMouseEnter={() => isEditorMode && setIsHovered(true)}
      onMouseLeave={() => isEditorMode && setIsHovered(false)}
      style={{
        ...editorStyles,
        ...appliedStyles
      }}
      className={isEditorMode ? 'visual-editor-element' : ''}
    >
      {isEditorMode && isHovered && !isSelected && (
        <div
          className="absolute -top-6 left-0 bg-blue-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1 z-50"
          style={{ pointerEvents: 'none' }}
        >
          <Edit2 size={12} />
          Clique para editar
        </div>
      )}

      {isEditorMode && isSelected && (
        <div
          className="absolute -top-6 left-0 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold z-50"
          style={{ pointerEvents: 'none' }}
        >
          Editando: {elementType}
        </div>
      )}

      {renderContent()}
    </div>
  );
}
