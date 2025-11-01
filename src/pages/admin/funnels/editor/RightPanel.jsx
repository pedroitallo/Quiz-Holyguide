import React, { useState, useEffect } from 'react';
import { X, Type, Image as ImageIcon, Palette, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function RightPanel({ element, onClose, onChange }) {
  const [localContent, setLocalContent] = useState(element?.content || {});
  const [localStyles, setLocalStyles] = useState(element?.styles || {});

  useEffect(() => {
    if (element) {
      setLocalContent(element.content || {});
      setLocalStyles(element.styles || {});
    }
  }, [element]);

  const handleContentChange = (key, value) => {
    const updated = { ...localContent, [key]: value };
    setLocalContent(updated);
    onChange({ content: updated });
  };

  const handleStyleChange = (property, value) => {
    const updated = { ...localStyles, [property]: value };
    setLocalStyles(updated);
    onChange({ styles: updated });
  };

  if (!element) return null;

  return (
    <div className="w-80 border-l border-slate-200 bg-white overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">
          Editar Elemento
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
        >
          <X size={16} />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="componente" className="w-full">
        <div className="border-b border-slate-200 px-4">
          <TabsList className="bg-transparent border-0 p-0 h-auto w-full grid grid-cols-3">
            <TabsTrigger
              value="componente"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none text-xs"
            >
              Componente
            </TabsTrigger>
            <TabsTrigger
              value="estilo"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none text-xs"
            >
              Estilo
            </TabsTrigger>
            <TabsTrigger
              value="exibicao"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none text-xs"
            >
              Exibição
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Componente Tab */}
        <TabsContent value="componente" className="p-4 space-y-4">
          <div>
            <Label className="text-xs">ID/Name</Label>
            <Input
              value={element.elementId}
              disabled
              className="text-xs mt-1"
            />
          </div>

          {element.elementType === 'text' && (
            <>
              <div>
                <Label className="text-xs">Texto</Label>
                <Textarea
                  value={localContent.text || ''}
                  onChange={(e) => handleContentChange('text', e.target.value)}
                  rows={4}
                  className="text-xs mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Tamanho</Label>
                  <Input
                    value={localStyles.fontSize || ''}
                    onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                    placeholder="16px"
                    className="text-xs mt-1"
                  />
                </div>

                <div>
                  <Label className="text-xs">Peso</Label>
                  <select
                    value={localStyles.fontWeight || 'normal'}
                    onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border rounded-lg mt-1"
                  >
                    <option value="normal">Normal</option>
                    <option value="500">Medium</option>
                    <option value="600">Semibold</option>
                    <option value="700">Bold</option>
                  </select>
                </div>
              </div>

              <div>
                <Label className="text-xs">Alinhamento</Label>
                <select
                  value={localStyles.textAlign || 'left'}
                  onChange={(e) => handleStyleChange('textAlign', e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border rounded-lg mt-1"
                >
                  <option value="left">Esquerda</option>
                  <option value="center">Centro</option>
                  <option value="right">Direita</option>
                </select>
              </div>
            </>
          )}

          {element.elementType === 'button' && (
            <>
              <div>
                <Label className="text-xs">Texto do Botão</Label>
                <Input
                  value={localContent.text || ''}
                  onChange={(e) => handleContentChange('text', e.target.value)}
                  className="text-xs mt-1"
                />
              </div>

              <div>
                <Label className="text-xs">Padding</Label>
                <Input
                  value={localStyles.padding || ''}
                  onChange={(e) => handleStyleChange('padding', e.target.value)}
                  placeholder="12px 32px"
                  className="text-xs mt-1"
                />
              </div>

              <div>
                <Label className="text-xs">Border Radius</Label>
                <Input
                  value={localStyles.borderRadius || ''}
                  onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                  placeholder="8px"
                  className="text-xs mt-1"
                />
              </div>
            </>
          )}
        </TabsContent>

        {/* Estilo Tab */}
        <TabsContent value="estilo" className="p-4 space-y-4">
          <div>
            <Label className="text-xs">Cor</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="color"
                value={localStyles.color || '#000000'}
                onChange={(e) => handleStyleChange('color', e.target.value)}
                className="w-12 h-8 p-1"
              />
              <Input
                type="text"
                value={localStyles.color || ''}
                onChange={(e) => handleStyleChange('color', e.target.value)}
                placeholder="#000000"
                className="text-xs flex-1"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs">Background</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="color"
                value={localStyles.backgroundColor || '#ffffff'}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                className="w-12 h-8 p-1"
              />
              <Input
                type="text"
                value={localStyles.backgroundColor || ''}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                placeholder="#ffffff"
                className="text-xs flex-1"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs">Margem</Label>
            <Input
              value={localStyles.margin || ''}
              onChange={(e) => handleStyleChange('margin', e.target.value)}
              placeholder="0px"
              className="text-xs mt-1"
            />
          </div>

          <div>
            <Label className="text-xs">Sombra</Label>
            <Input
              value={localStyles.boxShadow || ''}
              onChange={(e) => handleStyleChange('boxShadow', e.target.value)}
              placeholder="0 2px 4px rgba(0,0,0,0.1)"
              className="text-xs mt-1"
            />
          </div>

          <div>
            <Label className="text-xs">Opacidade</Label>
            <Input
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={localStyles.opacity || '1'}
              onChange={(e) => handleStyleChange('opacity', e.target.value)}
              className="text-xs mt-1"
            />
          </div>
        </TabsContent>

        {/* Exibição Tab */}
        <TabsContent value="exibicao" className="p-4 space-y-4">
          <div>
            <Label className="text-xs">Layout</Label>
            <select
              value={localStyles.display || 'block'}
              onChange={(e) => handleStyleChange('display', e.target.value)}
              className="w-full px-2 py-1.5 text-xs border rounded-lg mt-1"
            >
              <option value="block">Block</option>
              <option value="inline-block">Inline Block</option>
              <option value="flex">Flex</option>
              <option value="grid">Grid</option>
              <option value="none">None</option>
            </select>
          </div>

          <div>
            <Label className="text-xs">Largura</Label>
            <Input
              value={localStyles.width || ''}
              onChange={(e) => handleStyleChange('width', e.target.value)}
              placeholder="auto"
              className="text-xs mt-1"
            />
          </div>

          <div>
            <Label className="text-xs">Altura</Label>
            <Input
              value={localStyles.height || ''}
              onChange={(e) => handleStyleChange('height', e.target.value)}
              placeholder="auto"
              className="text-xs mt-1"
            />
          </div>

          <div>
            <Label className="text-xs">Z-Index</Label>
            <Input
              type="number"
              value={localStyles.zIndex || ''}
              onChange={(e) => handleStyleChange('zIndex', e.target.value)}
              placeholder="0"
              className="text-xs mt-1"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
