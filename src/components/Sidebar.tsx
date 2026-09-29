import React from 'react';
import { 
  LayoutDashboard, 
  AlertOctagon, 
  BrainCircuit, 
  Database, 
  BookOpen, 
  FileText, 
  GraduationCap, 
  Sliders, 
  BarChart3
} from 'lucide-react';
import { HindsightStatus } from '../types/index.ts';

export type NavTab = 
  | 'overview' 
  | 'incidents' 
  | 'investigator' 
  | 'memory' 
  | 'analytics' 
  | 'runbooks' 
  | 'postmortems' 
  | 'learning';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  hindsightStatus: HindsightStatus | null;
  onOpenJuryMode: () => void;
  onOpenDemoControls: () => void;
  onOpenHindsightStatus: () => void;
  activeIncidentsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  hindsightStatus,
  onOpenJuryMode,
  onOpenDemoControls,
  onOpenHindsightStatus,
  activeIncidentsCount
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'incidents', label: 'Incidents', icon: AlertOctagon, badge: activeIncidentsCount },
    { id: 'investigator', label: 'AI Investigator', icon: BrainCircuit },
    { id: 'memory', label: 'Memory Bank', icon: Database },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'runbooks', label: 'Runbooks', icon: BookOpen },
    { id: 'postmortems', label: 'Post-Mortems', icon: FileText },
    { id: 'learning', label: 'Learning Center', icon: GraduationCap },
  ];

  const isConnected = hindsightStatus?.connected;

  return (
    <aside className="w-56 bg-[#161616] border-r border-[#393939] flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none z-30">
      <div>
        {/* Brand / Logo Area */}
        <div className="h-12 px-4 border-b border-[#393939] flex items-center bg-[#161616]">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-sm bg-[#0F62FE] flex items-center justify-center text-white">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div className="leading-tight">
              <span className="font-mono font-bold text-sm tracking-wider text-[#F4F4F4]">OPSMIND</span>
              <span className="block text-[9px] font-mono text-[#8D8D8D] uppercase tracking-wider">AI Incident Ops</span>
            </div>
          </div>
        </div>

        {/* Navigation Items (Carbon High-Contrast Rail) */}
        <nav className="p-2 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id as NavTab)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-sm transition-colors text-left ${
                  isActive
                    ? 'bg-[#262626] text-[#F4F4F4] border-l-2 border-[#0F62FE]'
                    : 'text-[#C6C6C6] hover:text-[#F4F4F4] hover:bg-[#222222] border-l-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#4589FF]' : 'text-[#8D8D8D]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-xs bg-[#DA1E28]/20 text-[#FA4D56] font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Utility Controls */}
      <div className="p-3 border-t border-[#393939] space-y-1 bg-[#1c1c1c]">
        <button
          onClick={onOpenDemoControls}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-sm text-xs font-mono text-[#C6C6C6] hover:text-[#F4F4F4] hover:bg-[#262626] transition-colors"
        >
          <span className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-[#8D8D8D]" />
            <span>Demo Scripts</span>
          </span>
          <span className="text-[10px] text-[#6F6F6F]">v1.4</span>
        </button>

        <button
          onClick={onOpenHindsightStatus}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-sm text-[11px] font-mono text-[#C6C6C6] hover:text-[#F4F4F4] hover:bg-[#262626] transition-colors"
        >
          <span className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-[#24A148]' : 'bg-[#F1C21B]'}`} />
            <span>{isConnected ? 'Hindsight Live' : 'Demo Local'}</span>
          </span>
          <span className="text-[10px] text-[#8D8D8D] font-mono">Status →</span>
        </button>
      </div>
    </aside>
  );
};
