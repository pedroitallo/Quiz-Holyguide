import { Smartphone, Monitor, Eye, Code, Settings, Share2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function BuilderToolbar({ funnel, viewMode, onViewModeChange }) {
  const navigate = useNavigate();

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/funnels')}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Voltar
        </button>

        <div className="h-6 w-px bg-gray-300" />

        <div className="flex flex-col">
          <h1 className="text-sm font-semibold text-gray-900">
            {funnel?.name || 'Funil sem nome'}
          </h1>
          <p className="text-xs text-gray-500">Construtor Visual</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange('mobile')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
              viewMode === 'mobile'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Mobile
          </button>
          <button
            onClick={() => onViewModeChange('desktop')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
              viewMode === 'desktop'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Monitor className="w-4 h-4" />
            Desktop
          </button>
        </div>

        <div className="h-6 w-px bg-gray-300 mx-2" />

        <Button variant="ghost" size="sm">
          <Code className="w-4 h-4 mr-2" />
          Código
        </Button>

        <Button variant="ghost" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>

        <Button size="sm">
          <Save className="w-4 h-4 mr-2" />
          Salvar
        </Button>
      </div>
    </div>
  );
}
