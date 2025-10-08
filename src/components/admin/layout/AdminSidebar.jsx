import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  BarChart3,
  FlaskConical,
  FolderOpen,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const menuItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/admin/funnels', label: 'Quizzes', icon: Layers },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/admin/ab-tests', label: 'Testes A/B', icon: FlaskConical },
  { path: '/admin/files', label: 'Arquivos', icon: FolderOpen },
  { path: '/admin/settings', label: 'Configurações', icon: Settings },
];

export default function AdminSidebar({ collapsed, onToggle }) {
  const location = useLocation();

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen bg-slate-900 text-white
        transition-all duration-300 ease-in-out z-40
        ${collapsed ? 'w-16' : 'w-64'}
      `}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          {!collapsed && (
            <Link to="/admin" className="flex items-center gap-3">
              <img
                src="/APPYON LOGO.png"
                alt="Appyon Logo"
                className="w-10 h-10 object-contain"
              />
              <span className="font-bold text-lg">Appyon</span>
            </Link>
          )}
          {collapsed && (
            <Link to="/admin" className="flex items-center justify-center w-full">
              <img
                src="/APPYON LOGO.png"
                alt="Appyon Logo"
                className="w-8 h-8 object-contain"
              />
            </Link>
          )}
          {!collapsed && (
            <button
              onClick={onToggle}
              className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          {collapsed && (
            <button
              onClick={onToggle}
              className="absolute top-4 right-2 p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg
                      transition-all duration-200
                      ${active
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }
                      ${collapsed ? 'justify-center' : ''}
                    `}
                    title={collapsed ? item.label : ''}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    {!collapsed && (
                      <span className="font-medium text-sm">{item.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-800">
          {!collapsed && (
            <div className="text-xs text-slate-400 text-center">
              v1.0.0 - Appyon Admin
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
