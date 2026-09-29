import React, { useState, useEffect } from 'react';
import { Search, AlertOctagon, Database, ArrowRight, X } from 'lucide-react';
import { Incident } from '../../types/index.ts';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  incidents: Incident[];
  onSelectIncident: (id: string) => void;
  onNavigateTab: (tab: any) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  incidents,
  onSelectIncident,
  onNavigateTab
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or toggle
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredIncidents = incidents.filter(i => 
    i.id.toLowerCase().includes(query.toLowerCase()) ||
    i.title.toLowerCase().includes(query.toLowerCase()) ||
    i.service.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
      <div className="w-full max-w-xl bg-[#262626] border border-[#525252] shadow-2xl rounded-sm overflow-hidden flex flex-col text-sm animate-carbon-reveal">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#393939] gap-3 bg-[#161616]">
          <Search className="w-4 h-4 text-[#8D8D8D]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search incidents, services, or organizational memory... (ESC to exit)"
            className="flex-1 bg-transparent text-[#F4F4F4] placeholder-[#6F6F6F] outline-none text-xs font-mono"
          />
          <button onClick={onClose} className="text-[#8D8D8D] hover:text-[#F4F4F4]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          <div className="px-2 py-1 text-[11px] font-mono text-[#8D8D8D] uppercase tracking-wider">
            Matching Incidents ({filteredIncidents.length})
          </div>

          {filteredIncidents.length > 0 ? (
            filteredIncidents.map(inc => (
              <button
                key={inc.id}
                onClick={() => {
                  onSelectIncident(inc.id);
                  onClose();
                }}
                className="w-full text-left px-3 py-2 rounded-sm hover:bg-[#333333] flex items-center justify-between transition-colors group"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-[#4589FF]">{inc.id}</span>
                    <span className="text-xs font-medium text-[#F4F4F4]">{inc.title}</span>
                  </div>
                  <div className="text-[11px] text-[#8D8D8D] font-mono">
                    Service: {inc.service} • Severity: {inc.severity} • Status: {inc.status}
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#8D8D8D] group-hover:text-[#4589FF] group-hover:translate-x-0.5 transition-all" />
              </button>
            ))
          ) : (
            <div className="py-6 text-center text-xs text-[#8D8D8D] font-mono">
              No matching incidents found for "{query}"
            </div>
          )}

          <div className="pt-2 border-t border-[#393939] px-2 py-1 text-[11px] font-mono text-[#8D8D8D] uppercase tracking-wider">
            Quick Navigation
          </div>
          <button
            onClick={() => {
              onNavigateTab('memory');
              onClose();
            }}
            className="w-full text-left px-3 py-1.5 rounded-sm hover:bg-[#333333] flex items-center gap-2 text-xs text-[#C6C6C6]"
          >
            <Database className="w-3.5 h-3.5 text-[#4589FF]" />
            <span>Search Organizational Memory Bank</span>
          </button>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-[#161616] border-t border-[#393939] text-[10px] font-mono text-[#8D8D8D] flex items-center justify-between">
          <span>Navigate with ↑ ↓ • Press Enter to select</span>
          <span>Command Center Quick Search</span>
        </div>
      </div>
    </div>
  );
};
