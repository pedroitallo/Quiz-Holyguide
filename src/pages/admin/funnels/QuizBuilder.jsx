import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import BuilderSidebar from './builder/BuilderSidebar';
import BuilderPreview from './builder/BuilderPreview';
import BuilderComponentsPanel from './builder/BuilderComponentsPanel';
import BuilderToolbar from './builder/BuilderToolbar';
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';

export default function QuizBuilder() {
  const { id } = useParams();
  const [funnel, setFunnel] = useState(null);
  const [steps, setSteps] = useState([]);
  const [selectedStep, setSelectedStep] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [viewMode, setViewMode] = useState('mobile');
  const [activeTab, setActiveTab] = useState('components');
  const [loading, setLoading] = useState(true);
  const [activeDragId, setActiveDragId] = useState(null);

  useEffect(() => {
    loadFunnelData();
  }, [id]);

  async function loadFunnelData() {
    try {
      setLoading(true);

      const { data: funnelData, error: funnelError } = await supabase
        .from('funnels')
        .select('*')
        .eq('id', id)
        .single();

      if (funnelError) throw funnelError;

      const { data: stepsData, error: stepsError } = await supabase
        .from('funnel_steps')
        .select('*')
        .eq('funnel_id', id)
        .eq('is_archived', false)
        .order('position', { ascending: true });

      if (stepsError) throw stepsError;

      setFunnel(funnelData);
      setSteps(stepsData || []);
      if (stepsData?.length > 0) {
        setSelectedStep(stepsData[0]);
      }
    } catch (error) {
      console.error('Error loading funnel data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddStep() {
    try {
      const newPosition = steps.length;
      const { data, error } = await supabase
        .from('funnel_steps')
        .insert({
          funnel_id: id,
          name: `Página ${newPosition + 1}`,
          position: newPosition,
          config: {
            type: 'question',
            title: 'Nova Pergunta',
            description: '',
            elements: []
          }
        })
        .select()
        .single();

      if (error) throw error;

      setSteps([...steps, data]);
      setSelectedStep(data);
    } catch (error) {
      console.error('Error adding step:', error);
    }
  }

  async function handleUpdateStep(stepId, updates) {
    try {
      const { error } = await supabase
        .from('funnel_steps')
        .update(updates)
        .eq('id', stepId);

      if (error) throw error;

      setSteps(steps.map(s => s.id === stepId ? { ...s, ...updates } : s));
      if (selectedStep?.id === stepId) {
        setSelectedStep({ ...selectedStep, ...updates });
      }
    } catch (error) {
      console.error('Error updating step:', error);
    }
  }

  async function handleDeleteStep(stepId) {
    try {
      const { error } = await supabase
        .from('funnel_steps')
        .update({ is_archived: true })
        .eq('id', stepId);

      if (error) throw error;

      const newSteps = steps.filter(s => s.id !== stepId);
      setSteps(newSteps);
      if (selectedStep?.id === stepId && newSteps.length > 0) {
        setSelectedStep(newSteps[0]);
      }
    } catch (error) {
      console.error('Error deleting step:', error);
    }
  }

  function handleDragStart(event) {
    setActiveDragId(event.active.id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveDragId(null);

    if (!over || !selectedStep) return;

    const config = selectedStep.config || {};
    const elements = config.elements || [];

    if (active.data.current?.fromPanel) {
      const newElement = {
        id: `element-${Date.now()}`,
        type: active.id,
        props: getDefaultProps(active.id),
        position: elements.length
      };

      const updatedConfig = {
        ...config,
        elements: [...elements, newElement]
      };

      handleUpdateStep(selectedStep.id, { config: updatedConfig });
    }
  }

  function getDefaultProps(type) {
    const defaults = {
      heading: { text: 'Título da Pergunta', level: 'h1', alignment: 'center' },
      text: { text: 'Descrição ou texto explicativo', alignment: 'center' },
      button: { text: 'Continuar', style: 'primary' },
      input: { placeholder: 'Digite sua resposta...', type: 'text' },
      checkbox: { label: 'Opção de múltipla escolha', value: '' },
      radio: { label: 'Opção única', value: '' },
      image: { src: '', alt: 'Imagem', width: '100%' },
      video: { url: '', provider: 'youtube' },
      divider: { style: 'solid', color: '#e5e7eb' }
    };
    return defaults[type] || {};
  }

  function handleElementSelect(element) {
    setSelectedElement(element);
    setActiveTab('properties');
  }

  function handleElementUpdate(elementId, updates) {
    if (!selectedStep) return;

    const config = selectedStep.config || {};
    const elements = config.elements || [];
    const updatedElements = elements.map(el =>
      el.id === elementId ? { ...el, props: { ...el.props, ...updates } } : el
    );

    const updatedConfig = {
      ...config,
      elements: updatedElements
    };

    handleUpdateStep(selectedStep.id, { config: updatedConfig });
    setSelectedElement(prev => prev?.id === elementId ? { ...prev, props: { ...prev.props, ...updates } } : prev);
  }

  function handleElementDelete(elementId) {
    if (!selectedStep) return;

    const config = selectedStep.config || {};
    const elements = config.elements || [];
    const updatedElements = elements.filter(el => el.id !== elementId);

    const updatedConfig = {
      ...config,
      elements: updatedElements
    };

    handleUpdateStep(selectedStep.id, { config: updatedConfig });
    setSelectedElement(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-screen bg-gray-50">
        <BuilderToolbar
          funnel={funnel}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <div className="flex flex-1 overflow-hidden">
          <BuilderSidebar
            steps={steps}
            selectedStep={selectedStep}
            onSelectStep={setSelectedStep}
            onAddStep={handleAddStep}
            onUpdateStep={handleUpdateStep}
            onDeleteStep={handleDeleteStep}
          />

          <BuilderPreview
            step={selectedStep}
            viewMode={viewMode}
            selectedElement={selectedElement}
            onElementSelect={handleElementSelect}
            onElementUpdate={handleElementUpdate}
            onElementDelete={handleElementDelete}
          />

          <BuilderComponentsPanel
            activeTab={activeTab}
            onTabChange={setActiveTab}
            selectedElement={selectedElement}
            onElementUpdate={handleElementUpdate}
          />
        </div>

        <DragOverlay>
          {activeDragId ? (
            <div className="bg-white border-2 border-blue-500 rounded-lg p-4 shadow-lg">
              {activeDragId}
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
