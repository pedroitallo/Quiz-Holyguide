import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  X,
  Type,
  Palette,
  Image as ImageIcon,
  Volume2,
  Settings,
  Upload,
  History
} from 'lucide-react';
import { storage } from '../../lib/supabase';

export default function PropertiesPanel({
  selectedElement,
  onClose,
  onUpdate,
  onLoadHistory,
  history
}) {
  const [localContent, setLocalContent] = useState({});
  const [localStyles, setLocalStyles] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (selectedElement) {
      setLocalContent(selectedElement.content || {});
      setLocalStyles(selectedElement.styles || {});
    }
  }, [selectedElement]);

  if (!selectedElement) return null;

  const handleContentChange = (key, value) => {
    const newContent = { ...localContent, [key]: value };
    setLocalContent(newContent);
    onUpdate(selectedElement.elementId, {
      content: newContent,
      element_type: selectedElement.elementType
    });
  };

  const handleStyleChange = (property, value) => {
    const newStyles = { ...localStyles, [property]: value };
    setLocalStyles(newStyles);
    onUpdate(selectedElement.elementId, {
      css_overrides: newStyles,
      element_type: selectedElement.elementType
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const result = await storage.uploadFile(file, 'editor-uploads');
      handleContentChange('src', result.url);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Erro ao fazer upload da imagem');
    } finally {
      setUploading(false);
    }
  };

  const handleAudioUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const result = await storage.uploadFile(file, 'editor-uploads/audio');
      handleContentChange('src', result.url);
    } catch (error) {
      console.error('Error uploading audio:', error);
      alert('Erro ao fazer upload do áudio');
    } finally {
      setUploading(false);
    }
  };

  const renderTextEditor = () => (
    <div className="space-y-4">
      <div>
        <Label>Texto</Label>
        <Textarea
          value={localContent.text || ''}
          onChange={(e) => handleContentChange('text', e.target.value)}
          rows={4}
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Tamanho</Label>
          <Input
            type="text"
            value={localStyles.fontSize || ''}
            onChange={(e) => handleStyleChange('fontSize', e.target.value)}
            placeholder="16px"
            className="mt-1"
          />
        </div>

        <div>
          <Label>Cor</Label>
          <div className="flex gap-2 mt-1">
            <Input
              type="color"
              value={localStyles.color || '#000000'}
              onChange={(e) => handleStyleChange('color', e.target.value)}
              className="w-16 h-10 p-1"
            />
            <Input
              type="text"
              value={localStyles.color || ''}
              onChange={(e) => handleStyleChange('color', e.target.value)}
              placeholder="#000000"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Peso</Label>
          <select
            value={localStyles.fontWeight || 'normal'}
            onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-lg"
          >
            <option value="normal">Normal</option>
            <option value="500">Medium</option>
            <option value="600">Semibold</option>
            <option value="700">Bold</option>
            <option value="800">Extra Bold</option>
          </select>
        </div>

        <div>
          <Label>Alinhamento</Label>
          <select
            value={localStyles.textAlign || 'left'}
            onChange={(e) => handleStyleChange('textAlign', e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-lg"
          >
            <option value="left">Esquerda</option>
            <option value="center">Centro</option>
            <option value="right">Direita</option>
            <option value="justify">Justificado</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderImageEditor = () => (
    <div className="space-y-4">
      <div>
        <Label>URL da Imagem</Label>
        <Input
          type="text"
          value={localContent.src || ''}
          onChange={(e) => handleContentChange('src', e.target.value)}
          placeholder="https://..."
          className="mt-1"
        />
      </div>

      <div>
        <Label>Upload Nova Imagem</Label>
        <div className="mt-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
            disabled={uploading}
          />
          <label htmlFor="image-upload">
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              disabled={uploading}
              onClick={() => document.getElementById('image-upload').click()}
            >
              <Upload size={16} />
              {uploading ? 'Enviando...' : 'Escolher Imagem'}
            </Button>
          </label>
        </div>
      </div>

      <div>
        <Label>Texto Alternativo</Label>
        <Input
          type="text"
          value={localContent.alt || ''}
          onChange={(e) => handleContentChange('alt', e.target.value)}
          placeholder="Descrição da imagem"
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Largura</Label>
          <Input
            type="text"
            value={localStyles.width || ''}
            onChange={(e) => handleStyleChange('width', e.target.value)}
            placeholder="auto"
            className="mt-1"
          />
        </div>

        <div>
          <Label>Altura</Label>
          <Input
            type="text"
            value={localStyles.height || ''}
            onChange={(e) => handleStyleChange('height', e.target.value)}
            placeholder="auto"
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label>Borda Arredondada</Label>
        <Input
          type="text"
          value={localStyles.borderRadius || ''}
          onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
          placeholder="0px"
          className="mt-1"
        />
      </div>
    </div>
  );

  const renderAudioEditor = () => (
    <div className="space-y-4">
      <div>
        <Label>URL do Áudio</Label>
        <Input
          type="text"
          value={localContent.src || ''}
          onChange={(e) => handleContentChange('src', e.target.value)}
          placeholder="https://..."
          className="mt-1"
        />
      </div>

      <div>
        <Label>Upload Novo Áudio</Label>
        <div className="mt-1">
          <input
            type="file"
            accept="audio/*"
            onChange={handleAudioUpload}
            className="hidden"
            id="audio-upload"
            disabled={uploading}
          />
          <label htmlFor="audio-upload">
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              disabled={uploading}
              onClick={() => document.getElementById('audio-upload').click()}
            >
              <Upload size={16} />
              {uploading ? 'Enviando...' : 'Escolher Áudio'}
            </Button>
          </label>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="autoplay"
          checked={localContent.autoplay || false}
          onChange={(e) => handleContentChange('autoplay', e.target.checked)}
          className="w-4 h-4"
        />
        <Label htmlFor="autoplay">Reproduzir automaticamente</Label>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="loop"
          checked={localContent.loop || false}
          onChange={(e) => handleContentChange('loop', e.target.checked)}
          className="w-4 h-4"
        />
        <Label htmlFor="loop">Loop</Label>
      </div>
    </div>
  );

  const renderButtonEditor = () => (
    <div className="space-y-4">
      <div>
        <Label>Texto do Botão</Label>
        <Input
          type="text"
          value={localContent.text || ''}
          onChange={(e) => handleContentChange('text', e.target.value)}
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Cor de Fundo</Label>
          <div className="flex gap-2 mt-1">
            <Input
              type="color"
              value={localStyles.backgroundColor || '#3b82f6'}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              className="w-16 h-10 p-1"
            />
            <Input
              type="text"
              value={localStyles.backgroundColor || ''}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              placeholder="#3b82f6"
            />
          </div>
        </div>

        <div>
          <Label>Cor do Texto</Label>
          <div className="flex gap-2 mt-1">
            <Input
              type="color"
              value={localStyles.color || '#ffffff'}
              onChange={(e) => handleStyleChange('color', e.target.value)}
              className="w-16 h-10 p-1"
            />
            <Input
              type="text"
              value={localStyles.color || ''}
              onChange={(e) => handleStyleChange('color', e.target.value)}
              placeholder="#ffffff"
            />
          </div>
        </div>
      </div>

      <div>
        <Label>Padding</Label>
        <Input
          type="text"
          value={localStyles.padding || ''}
          onChange={(e) => handleStyleChange('padding', e.target.value)}
          placeholder="12px 24px"
          className="mt-1"
        />
      </div>

      <div>
        <Label>Borda Arredondada</Label>
        <Input
          type="text"
          value={localStyles.borderRadius || ''}
          onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
          placeholder="8px"
          className="mt-1"
        />
      </div>
    </div>
  );

  const renderBackgroundEditor = () => (
    <div className="space-y-4">
      <div>
        <Label>Cor de Fundo</Label>
        <div className="flex gap-2 mt-1">
          <Input
            type="color"
            value={localStyles.backgroundColor || '#ffffff'}
            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
            className="w-16 h-10 p-1"
          />
          <Input
            type="text"
            value={localStyles.backgroundColor || ''}
            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
            placeholder="#ffffff"
          />
        </div>
      </div>

      <div>
        <Label>Gradiente (CSS)</Label>
        <Input
          type="text"
          value={localStyles.background || ''}
          onChange={(e) => handleStyleChange('background', e.target.value)}
          placeholder="linear-gradient(to right, #ff0000, #00ff00)"
          className="mt-1"
        />
      </div>

      <div>
        <Label>Imagem de Fundo</Label>
        <Input
          type="text"
          value={localContent.backgroundImage || ''}
          onChange={(e) => handleContentChange('backgroundImage', e.target.value)}
          placeholder="url(https://...)"
          className="mt-1"
        />
      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {history.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-4">
          Nenhum histórico disponível
        </p>
      ) : (
        history.map((entry) => (
          <div
            key={entry.id}
            className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm"
          >
            <p className="font-medium">Versão {entry.version}</p>
            <p className="text-xs text-slate-500 mt-1">
              {new Date(entry.created_at).toLocaleString('pt-BR')}
            </p>
            <Button
              size="sm"
              variant="outline"
              className="mt-2 w-full"
              onClick={() => {
                if (confirm('Deseja restaurar esta versão?')) {
                  onUpdate(selectedElement.elementId, {
                    content: entry.content,
                    css_overrides: entry.css_overrides
                  });
                }
              }}
            >
              Restaurar
            </Button>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="fixed top-20 left-6 z-50 w-96 bg-white shadow-2xl rounded-lg border border-slate-200 overflow-hidden max-h-[80vh] flex flex-col">
      <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings size={18} />
          <span className="font-semibold">Propriedades</span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={onClose}
          className="text-white hover:text-white hover:bg-slate-800"
        >
          <X size={18} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="w-full grid grid-cols-3 rounded-none border-b">
            <TabsTrigger value="content" className="gap-2">
              <Type size={14} />
              Conteúdo
            </TabsTrigger>
            <TabsTrigger value="style" className="gap-2">
              <Palette size={14} />
              Estilo
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="gap-2"
              onClick={() => onLoadHistory(selectedElement.elementId)}
            >
              <History size={14} />
              Histórico
            </TabsTrigger>
          </TabsList>

          <div className="p-4">
            <TabsContent value="content" className="mt-0">
              {selectedElement.elementType === 'text' && renderTextEditor()}
              {selectedElement.elementType === 'image' && renderImageEditor()}
              {selectedElement.elementType === 'audio' && renderAudioEditor()}
              {selectedElement.elementType === 'button' && renderButtonEditor()}
              {selectedElement.elementType === 'background' && renderBackgroundEditor()}
            </TabsContent>

            <TabsContent value="style" className="mt-0">
              <div className="space-y-4">
                <div>
                  <Label>Margem</Label>
                  <Input
                    type="text"
                    value={localStyles.margin || ''}
                    onChange={(e) => handleStyleChange('margin', e.target.value)}
                    placeholder="0px"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Padding</Label>
                  <Input
                    type="text"
                    value={localStyles.padding || ''}
                    onChange={(e) => handleStyleChange('padding', e.target.value)}
                    placeholder="0px"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Borda</Label>
                  <Input
                    type="text"
                    value={localStyles.border || ''}
                    onChange={(e) => handleStyleChange('border', e.target.value)}
                    placeholder="1px solid #000"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Sombra</Label>
                  <Input
                    type="text"
                    value={localStyles.boxShadow || ''}
                    onChange={(e) => handleStyleChange('boxShadow', e.target.value)}
                    placeholder="0 2px 4px rgba(0,0,0,0.1)"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Opacidade</Label>
                  <Input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={localStyles.opacity || '1'}
                    onChange={(e) => handleStyleChange('opacity', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              {renderHistoryTab()}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
