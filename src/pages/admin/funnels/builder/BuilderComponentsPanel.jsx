import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import {
  Type,
  Heading1,
  Square,
  Image,
  Video,
  CheckSquare,
  Circle,
  Minus,
  Settings,
  Layers
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function BuilderComponentsPanel({
  activeTab,
  onTabChange,
  selectedElement,
  onElementUpdate
}) {
  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => onTabChange('components')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'components'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Layers className="w-4 h-4 inline mr-2" />
            Componentes
          </button>
          <button
            onClick={() => onTabChange('properties')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'properties'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            Propriedades
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'components' ? (
          <ComponentsTab />
        ) : (
          <PropertiesTab
            element={selectedElement}
            onUpdate={onElementUpdate}
          />
        )}
      </div>
    </div>
  );
}

function ComponentsTab() {
  const components = [
    { id: 'heading', label: 'Título', icon: Heading1, description: 'H1, H2, H3' },
    { id: 'text', label: 'Texto', icon: Type, description: 'Parágrafo' },
    { id: 'button', label: 'Botão', icon: Square, description: 'CTA' },
    { id: 'input', label: 'Campo de texto', icon: Type, description: 'Input' },
    { id: 'checkbox', label: 'Checkbox', icon: CheckSquare, description: 'Múltipla escolha' },
    { id: 'radio', label: 'Radio', icon: Circle, description: 'Escolha única' },
    { id: 'image', label: 'Imagem', icon: Image, description: 'PNG, JPG' },
    { id: 'video', label: 'Vídeo', icon: Video, description: 'YouTube, Vimeo' },
    { id: 'divider', label: 'Divisor', icon: Minus, description: 'Linha horizontal' }
  ];

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">
        Elementos Básicos
      </h3>
      <div className="space-y-2">
        {components.map((component) => (
          <DraggableComponent key={component.id} component={component} />
        ))}
      </div>
    </div>
  );
}

function DraggableComponent({ component }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: component.id,
    data: { fromPanel: true }
  });

  const Icon = component.icon;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex items-start gap-3 p-3 rounded-lg border-2 border-gray-200 cursor-move hover:border-blue-500 hover:bg-blue-50 transition-all ${
        isDragging ? 'opacity-50 scale-95' : ''
      }`}
    >
      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-gray-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900">
          {component.label}
        </div>
        <div className="text-xs text-gray-500">
          {component.description}
        </div>
      </div>
    </div>
  );
}

function PropertiesTab({ element, onUpdate }) {
  if (!element) {
    return (
      <div className="p-4 text-center text-gray-400 text-sm">
        Selecione um elemento para editar suas propriedades
      </div>
    );
  }

  const props = element.props || {};

  const renderProperties = () => {
    switch (element.type) {
      case 'heading':
        return (
          <>
            <PropertyGroup label="Texto">
              <Input
                value={props.text || ''}
                onChange={(e) => onUpdate(element.id, { text: e.target.value })}
                placeholder="Título"
              />
            </PropertyGroup>

            <PropertyGroup label="Nível">
              <Select
                value={props.level || 'h1'}
                onValueChange={(value) => onUpdate(element.id, { level: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="h1">H1 - Grande</SelectItem>
                  <SelectItem value="h2">H2 - Médio</SelectItem>
                  <SelectItem value="h3">H3 - Pequeno</SelectItem>
                </SelectContent>
              </Select>
            </PropertyGroup>

            <PropertyGroup label="Alinhamento">
              <Select
                value={props.alignment || 'center'}
                onValueChange={(value) => onUpdate(element.id, { alignment: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Esquerda</SelectItem>
                  <SelectItem value="center">Centro</SelectItem>
                  <SelectItem value="right">Direita</SelectItem>
                </SelectContent>
              </Select>
            </PropertyGroup>
          </>
        );

      case 'text':
        return (
          <>
            <PropertyGroup label="Texto">
              <Textarea
                value={props.text || ''}
                onChange={(e) => onUpdate(element.id, { text: e.target.value })}
                placeholder="Digite o texto..."
                rows={4}
              />
            </PropertyGroup>

            <PropertyGroup label="Alinhamento">
              <Select
                value={props.alignment || 'center'}
                onValueChange={(value) => onUpdate(element.id, { alignment: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Esquerda</SelectItem>
                  <SelectItem value="center">Centro</SelectItem>
                  <SelectItem value="right">Direita</SelectItem>
                </SelectContent>
              </Select>
            </PropertyGroup>
          </>
        );

      case 'button':
        return (
          <>
            <PropertyGroup label="Texto do Botão">
              <Input
                value={props.text || ''}
                onChange={(e) => onUpdate(element.id, { text: e.target.value })}
                placeholder="Continuar"
              />
            </PropertyGroup>

            <PropertyGroup label="Estilo">
              <Select
                value={props.style || 'primary'}
                onValueChange={(value) => onUpdate(element.id, { style: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primário (Azul)</SelectItem>
                  <SelectItem value="secondary">Secundário (Cinza)</SelectItem>
                </SelectContent>
              </Select>
            </PropertyGroup>
          </>
        );

      case 'input':
        return (
          <>
            <PropertyGroup label="Placeholder">
              <Input
                value={props.placeholder || ''}
                onChange={(e) => onUpdate(element.id, { placeholder: e.target.value })}
                placeholder="Digite sua resposta..."
              />
            </PropertyGroup>

            <PropertyGroup label="Tipo">
              <Select
                value={props.type || 'text'}
                onValueChange={(value) => onUpdate(element.id, { type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Texto</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="tel">Telefone</SelectItem>
                  <SelectItem value="number">Número</SelectItem>
                  <SelectItem value="date">Data</SelectItem>
                </SelectContent>
              </Select>
            </PropertyGroup>
          </>
        );

      case 'checkbox':
      case 'radio':
        return (
          <>
            <PropertyGroup label="Label">
              <Input
                value={props.label || ''}
                onChange={(e) => onUpdate(element.id, { label: e.target.value })}
                placeholder="Texto da opção"
              />
            </PropertyGroup>

            <PropertyGroup label="Valor">
              <Input
                value={props.value || ''}
                onChange={(e) => onUpdate(element.id, { value: e.target.value })}
                placeholder="valor-interno"
              />
            </PropertyGroup>
          </>
        );

      case 'image':
        return (
          <>
            <PropertyGroup label="URL da Imagem">
              <Input
                value={props.src || ''}
                onChange={(e) => onUpdate(element.id, { src: e.target.value })}
                placeholder="https://..."
              />
            </PropertyGroup>

            <PropertyGroup label="Texto Alternativo">
              <Input
                value={props.alt || ''}
                onChange={(e) => onUpdate(element.id, { alt: e.target.value })}
                placeholder="Descrição da imagem"
              />
            </PropertyGroup>

            <PropertyGroup label="Largura">
              <Input
                value={props.width || '100%'}
                onChange={(e) => onUpdate(element.id, { width: e.target.value })}
                placeholder="100%"
              />
            </PropertyGroup>
          </>
        );

      case 'video':
        return (
          <>
            <PropertyGroup label="URL do Vídeo">
              <Input
                value={props.url || ''}
                onChange={(e) => onUpdate(element.id, { url: e.target.value })}
                placeholder="https://youtube.com/..."
              />
            </PropertyGroup>

            <PropertyGroup label="Provedor">
              <Select
                value={props.provider || 'youtube'}
                onValueChange={(value) => onUpdate(element.id, { provider: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="vimeo">Vimeo</SelectItem>
                </SelectContent>
              </Select>
            </PropertyGroup>
          </>
        );

      case 'divider':
        return (
          <>
            <PropertyGroup label="Estilo">
              <Select
                value={props.style || 'solid'}
                onValueChange={(value) => onUpdate(element.id, { style: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Sólido</SelectItem>
                  <SelectItem value="dashed">Tracejado</SelectItem>
                  <SelectItem value="dotted">Pontilhado</SelectItem>
                </SelectContent>
              </Select>
            </PropertyGroup>

            <PropertyGroup label="Cor">
              <Input
                type="color"
                value={props.color || '#e5e7eb'}
                onChange={(e) => onUpdate(element.id, { color: e.target.value })}
              />
            </PropertyGroup>
          </>
        );

      default:
        return (
          <div className="text-sm text-gray-400">
            Propriedades não disponíveis para este tipo de elemento
          </div>
        );
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="pb-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">
          {element.type.charAt(0).toUpperCase() + element.type.slice(1)}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Editar propriedades do elemento
        </p>
      </div>

      {renderProperties()}
    </div>
  );
}

function PropertyGroup({ label, children }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-gray-700">{label}</Label>
      {children}
    </div>
  );
}
