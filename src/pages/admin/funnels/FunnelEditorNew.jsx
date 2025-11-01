import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, History, Eye, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import StepsSidebar from './editor/StepsSidebar';
import CentralPreview from './editor/CentralPreview';
import RightPanel from './editor/RightPanel';
import DesignTab from './editor/DesignTab';
import SettingsTab from './editor/SettingsTab';
import HistoryModal from './editor/HistoryModal';

export default function FunnelEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [funnel, setFunnel] = useState(null);
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedElement, setSelectedElement] = useState(null);
  const [activeTab, setActiveTab] = useState('construtor');
  const [showHistory, setShowHistory] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadFunnel();
      loadSteps();
    }
  }, [id]);

  const loadFunnel = async () => {
    try {
      const { data, error } = await supabase
        .from('funnels')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      setFunnel(data);
    } catch (error) {
      console.error('Error loading funnel:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSteps = async () => {
    try {
      const { data, error } = await supabase
        .from('funnel_steps')
        .select('*')
        .eq('funnel_id', id)
        .eq('archived', false)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setSteps(data || []);
    } catch (error) {
      console.error('Error loading steps:', error);
    }
  };

  const handleSave = async () => {
    if (!funnel) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('funnels')
        .update({
          name: funnel.name,
          slug: funnel.slug,
          description: funnel.description,
          status: funnel.status
        })
        .eq('id', id);

      if (error) throw error;

      setHasChanges(false);
      alert('Alterações salvas com sucesso!');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Erro ao salvar alterações: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    if (funnel) {
      window.open(`/${funnel.slug}`, '_blank');
    }
  };

  const currentStep = steps[currentStepIndex];

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Carregando editor...</p>
        </div>
      </div>
    );
  }

  if (!funnel) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Funil não encontrado</p>
          <Button onClick={() => navigate('/admin/funnels')}>
            Voltar para Funis
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/funnels')}
            className="gap-2"
          >
            <ArrowLeft size={16} />
            Voltar
          </Button>

          <div className="h-6 w-px bg-slate-300" />

          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              {funnel.name}
            </h1>
            <p className="text-xs text-slate-500">
              {steps.length} etapa{steps.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(true)}
            className="gap-2"
          >
            <History size={16} />
            Histórico
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            className="gap-2"
          >
            <Eye size={16} />
            Preview
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Save size={16} />
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>

          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            Publicar
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="bg-white border-b border-slate-200 px-4">
          <TabsList className="bg-transparent border-0 p-0 h-auto">
            <TabsTrigger
              value="construtor"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-6 py-3"
            >
              Construtor
            </TabsTrigger>
            <TabsTrigger
              value="design"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-6 py-3"
            >
              Design
            </TabsTrigger>
            <TabsTrigger
              value="configuracoes"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-6 py-3"
            >
              Configurações
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          <TabsContent value="construtor" className="h-full m-0">
            <div className="h-full flex">
              {/* Left Sidebar - Steps List */}
              <StepsSidebar
                steps={steps}
                currentStepIndex={currentStepIndex}
                onStepSelect={setCurrentStepIndex}
                onStepsChange={(newSteps) => {
                  setSteps(newSteps);
                  setHasChanges(true);
                }}
              />

              {/* Center - Preview */}
              <CentralPreview
                funnel={funnel}
                step={currentStep}
                onElementSelect={setSelectedElement}
                selectedElement={selectedElement}
              />

              {/* Right Sidebar - Element Editor */}
              {selectedElement && (
                <RightPanel
                  element={selectedElement}
                  onClose={() => setSelectedElement(null)}
                  onChange={() => setHasChanges(true)}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="design" className="h-full m-0 overflow-auto">
            <DesignTab
              funnel={funnel}
              onChange={() => setHasChanges(true)}
            />
          </TabsContent>

          <TabsContent value="configuracoes" className="h-full m-0 overflow-auto">
            <SettingsTab
              funnel={funnel}
              onUpdate={(updatedFunnel) => {
                setFunnel(updatedFunnel);
                setHasChanges(true);
              }}
            />
          </TabsContent>
        </div>
      </Tabs>

      {/* History Modal */}
      {showHistory && (
        <HistoryModal
          funnelId={id}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}
