import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  ArrowRight,
  Clock,
  Activity,
  BrainCircuit,
  Filter,
  CheckCircle2,
  AlertOctagon,
  ChevronDown,
  X,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import { Incident } from '../types/index.ts';
import { SeverityBadge } from './common/SeverityBadge.tsx';

interface IncidentsListViewProps {
  incidents: Incident[];
  onSelectIncident: (id: string) => void;
  onOpenNewIncident: () => void;
}

export type SeverityLevel = 'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

const SEVERITY_CONFIG: Record<
  SeverityLevel,
  {
    label: string;
    subLabel: string;
    badgeClass: string;
    indicatorDot: string;
    matchingKeys: string[];
  }
> = {
  ALL: {
    label: 'All Severities',
    subLabel: 'SEV-1 to INFO',
    badgeClass: 'text-[#C6C6C6] border-[#525252]',
    indicatorDot: 'bg-[#8D8D8D]',
    matchingKeys: ['ALL']
  },
  CRITICAL: {
    label: 'Critical',
    subLabel: 'SEV-1',
    badgeClass: 'text-[#FA4D56] border-[#DA1E28]/50 bg-[#DA1E28]/15',
    indicatorDot: 'bg-[#DA1E28]',
    matchingKeys: ['SEV-1', 'CRITICAL']
  },
  HIGH: {
    label: 'High',
    subLabel: 'SEV-2',
    badgeClass: 'text-[#FF832B] border-[#FF832B]/50 bg-[#FF832B]/15',
    indicatorDot: 'bg-[#FF832B]',
    matchingKeys: ['SEV-2', 'HIGH']
  },
  MEDIUM: {
    label: 'Medium',
    subLabel: 'SEV-3',
    badgeClass: 'text-[#F1C21B] border-[#F1C21B]/50 bg-[#F1C21B]/15',
    indicatorDot: 'bg-[#F1C21B]',
    matchingKeys: ['SEV-3', 'MEDIUM']
  },
  LOW: {
    label: 'Low',
    subLabel: 'SEV-4',
    badgeClass: 'text-[#42BE65] border-[#24A148]/50 bg-[#24A148]/15',
    indicatorDot: 'bg-[#24A148]',
    matchingKeys: ['SEV-4', 'LOW']
  },
  INFO: {
    label: 'Info',
    subLabel: 'SEV-5 / Informational',
    badgeClass: 'text-[#78A9FF] border-[#0F62FE]/50 bg-[#0F62FE]/15',
    indicatorDot: 'bg-[#0F62FE]',
    matchingKeys: ['SEV-5', 'INFO', 'INFORMATIONAL']
  }
};

const STORAGE_KEY = 'opsmind_incidents_severity_filter';

export const IncidentsListView: React.FC<IncidentsListViewProps> = ({
  incidents,
  onSelectIncident,
  onOpenNewIncident
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');
  const [search, setSearch] = useState('');
  
  // Persistent Severity filter state (saved to localStorage)
  const [severityFilter, setSeverityFilter] = useState<SeverityLevel>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && saved in SEVERITY_CONFIG) {
        return saved as SeverityLevel;
      }
    } catch {}
    return 'ALL';
  });

  const [isSeverityDropdownOpen, setIsSeverityDropdownOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, severityFilter);
    } catch {}
  }, [severityFilter]);

  // Helper to test if an incident matches the chosen severity
  const matchesSeverity = (inc: Incident, targetSeverity: SeverityLevel): boolean => {
    if (targetSeverity === 'ALL') return true;
    const config = SEVERITY_CONFIG[targetSeverity];
    const norm = (inc.severity || '').toUpperCase();
    return config.matchingKeys.some(key => norm.includes(key));
  };

  const filtered = incidents.filter(i => {
    if (filter === 'active' && i.status === 'RESOLVED') return false;
    if (filter === 'resolved' && i.status !== 'RESOLVED') return false;
    if (!matchesSeverity(i, severityFilter)) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        i.title.toLowerCase().includes(q) || 
        i.service.toLowerCase().includes(q) || 
        i.id.toLowerCase().includes(q) ||
        (i.severity && i.severity.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const activeCount = incidents.filter(i => i.status !== 'RESOLVED').length;
  const criticalCount = incidents.filter(i => (i.severity === 'SEV-1' || (i.severity as string).toUpperCase() === 'CRITICAL') && i.status !== 'RESOLVED').length;

  // Counts for each severity category
  const severityCounts: Record<SeverityLevel, number> = {
    ALL: incidents.length,
    CRITICAL: incidents.filter(i => matchesSeverity(i, 'CRITICAL')).length,
    HIGH: incidents.filter(i => matchesSeverity(i, 'HIGH')).length,
    MEDIUM: incidents.filter(i => matchesSeverity(i, 'MEDIUM')).length,
    LOW: incidents.filter(i => matchesSeverity(i, 'LOW')).length,
    INFO: incidents.filter(i => matchesSeverity(i, 'INFO')).length
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5 animate-carbon-reveal">
      {/* 1. Page Header (Carbon Standard) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#393939]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-[#F4F4F4] tracking-tight">
              Production Incidents
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-xs bg-[#262626] text-[#C6C6C6] border border-[#393939]">
              {incidents.length} TOTAL
            </span>
            {criticalCount > 0 && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-xs bg-[#DA1E28]/15 text-[#FA4D56] border border-[#DA1E28]/40">
                {criticalCount} CRITICAL ACTIVE
              </span>
            )}
          </div>
          <p className="text-xs text-[#C6C6C6] mt-0.5">
            Active and historical production incidents across the distributed service topology.
          </p>
        </div>

        <button
          onClick={onOpenNewIncident}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-[#0F62FE] hover:bg-[#0353E9] active:bg-[#0043CE] text-white text-xs font-medium transition-colors self-start sm:self-center cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Incident</span>
        </button>
      </div>

      {/* 2. Filter & Search Bar */}
      <div className="space-y-2.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter Tabs */}
            <div className="flex items-center bg-[#262626] p-0.5 rounded-xs border border-[#393939]">
              {(['all', 'active', 'resolved'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-3 py-1 font-mono uppercase text-[11px] transition-colors cursor-pointer ${
                    filter === tab 
                      ? 'bg-[#393939] text-[#F4F4F4] font-semibold border-b-2 border-[#0F62FE]' 
                      : 'text-[#8D8D8D] hover:text-[#C6C6C6]'
                  }`}
                >
                  {tab === 'all' ? `All (${incidents.length})` : tab === 'active' ? `Active (${activeCount})` : `Resolved (${incidents.length - activeCount})`}
                </button>
              ))}
            </div>

            {/* Severity Filter Dropdown (Custom Carbon Selector) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSeverityDropdownOpen(!isSeverityDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xs border text-xs font-mono transition-colors cursor-pointer ${
                  severityFilter !== 'ALL'
                    ? 'bg-[#262626] border-[#0F62FE] text-[#F4F4F4] shadow-xs'
                    : 'bg-[#262626] border-[#393939] hover:border-[#525252] text-[#C6C6C6]'
                }`}
                title="Filter by incident severity"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#0F62FE]" />
                <span className="text-[#8D8D8D] text-[11px] uppercase tracking-wider font-semibold">Severity:</span>
                <span className="flex items-center gap-1.5 font-medium text-[#F4F4F4]">
                  <span className={`w-2 h-2 rounded-full ${SEVERITY_CONFIG[severityFilter].indicatorDot}`} />
                  <span>{SEVERITY_CONFIG[severityFilter].label}</span>
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#8D8D8D] transition-transform ${isSeverityDropdownOpen ? 'rotate-180 text-[#0F62FE]' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isSeverityDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setIsSeverityDropdownOpen(false)} 
                  />
                  <div className="absolute left-0 top-full mt-1 w-64 bg-[#1e1e1e] border border-[#393939] rounded-xs shadow-xl z-40 p-1 space-y-0.5 animate-carbon-reveal font-mono text-xs">
                    <div className="px-2.5 py-1.5 text-[10px] text-[#8D8D8D] uppercase tracking-wider font-semibold border-b border-[#2d2d2d] flex items-center justify-between">
                      <span>Filter by Severity</span>
                      <span className="text-[9px] text-[#4589FF]">PERSISTENT</span>
                    </div>

                    {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'] as SeverityLevel[]).map(sev => {
                      const cfg = SEVERITY_CONFIG[sev];
                      const count = severityCounts[sev];
                      const isSelected = severityFilter === sev;

                      return (
                        <button
                          key={sev}
                          type="button"
                          onClick={() => {
                            setSeverityFilter(sev);
                            setIsSeverityDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xs transition-colors text-left cursor-pointer ${
                            isSelected 
                              ? 'bg-[#2b2b2b] text-[#F4F4F4] font-medium border-l-2 border-[#0F62FE]' 
                              : 'text-[#C6C6C6] hover:bg-[#262626] hover:text-[#F4F4F4]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${cfg.indicatorDot}`} />
                            <div>
                              <div className="leading-tight">{cfg.label}</div>
                              <div className="text-[10px] text-[#8D8D8D] font-normal">{cfg.subLabel}</div>
                            </div>
                          </div>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-xs border ${
                            isSelected
                              ? 'bg-[#0F62FE]/20 text-[#78A9FF] border-[#0F62FE]/40'
                              : 'bg-[#161616] text-[#8D8D8D] border-[#333333]'
                          }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}

                    {severityFilter !== 'ALL' && (
                      <div className="pt-1 mt-1 border-t border-[#2d2d2d]">
                        <button
                          type="button"
                          onClick={() => {
                            setSeverityFilter('ALL');
                            setIsSeverityDropdownOpen(false);
                          }}
                          className="w-full text-center py-1 text-[11px] text-[#4589FF] hover:text-[#78A9FF] transition-colors cursor-pointer flex items-center justify-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset to All Severities</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Quick Reset if filtered */}
            {severityFilter !== 'ALL' && (
              <button
                type="button"
                onClick={() => setSeverityFilter('ALL')}
                className="flex items-center gap-1 px-2 py-1 rounded-xs bg-[#262626] hover:bg-[#333333] border border-[#393939] text-[11px] font-mono text-[#FA4D56] transition-colors cursor-pointer"
                title="Clear severity filter"
              >
                <X className="w-3 h-3" />
                <span>Clear Severity ({severityFilter})</span>
              </button>
            )}
          </div>

          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, title, service, severity..."
              className="w-full sm:w-80 pl-8 pr-3 py-1.5 bg-[#262626] border border-[#393939] focus:border-[#0F62FE] rounded-xs text-xs font-mono text-[#F4F4F4] placeholder-[#8D8D8D] outline-none transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-[#8D8D8D] absolute left-2.5 top-2" />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-2 top-2 text-[#8D8D8D] hover:text-[#F4F4F4] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Severity Button Pills Set (Direct Quick Toggles) */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#262626]/80">
          <span className="text-[10px] font-mono text-[#8D8D8D] uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#8D8D8D]" />
            <span>Quick Filter:</span>
          </span>

          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'] as SeverityLevel[]).map(sev => {
            const cfg = SEVERITY_CONFIG[sev];
            const isSelected = severityFilter === sev;
            const count = severityCounts[sev];

            return (
              <button
                key={sev}
                type="button"
                onClick={() => setSeverityFilter(sev)}
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs text-[11px] font-mono border transition-all cursor-pointer ${
                  isSelected
                    ? `${cfg.badgeClass} ring-1 ring-[#0F62FE]/40 font-semibold shadow-xs`
                    : 'bg-[#1e1e1e] text-[#8D8D8D] border-[#333333] hover:text-[#C6C6C6] hover:border-[#4d4d4d]'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.indicatorDot}`} />
                <span>{cfg.label}</span>
                <span className={`text-[10px] px-1 py-0.1 rounded-2xs ${
                  isSelected ? 'bg-black/30' : 'bg-[#161616]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}

          <div className="ml-auto text-[11px] font-mono text-[#8D8D8D]">
            Showing <span className="text-[#F4F4F4] font-medium">{filtered.length}</span> of {incidents.length} incidents
          </div>
        </div>
      </div>

      {/* 3. IBM Carbon Incident Table (Section 13) */}
      <div className="carbon-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#393939] bg-[#1a1a1a] text-[11px] font-mono text-[#8D8D8D] uppercase tracking-wider">
                <th className="py-2.5 px-3 font-medium">Severity</th>
                <th className="py-2.5 px-3 font-medium">Incident</th>
                <th className="py-2.5 px-3 font-medium">Service</th>
                <th className="py-2.5 px-3 font-medium">Status</th>
                <th className="py-2.5 px-3 font-medium">Telemetry Signals</th>
                <th className="py-2.5 px-3 font-medium">Detected / Duration</th>
                <th className="py-2.5 px-3 font-medium">AI Confidence</th>
                <th className="py-2.5 px-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#393939] text-xs">
              {filtered.map(inc => {
                const isResolved = inc.status === 'RESOLVED';
                const confidence = inc.investigation?.confidence || (inc.id === 'INC-137' ? 'High' : 'Medium');
                const hasMemoryMatch = (inc.investigation?.historicalMatches?.length || 0) > 0 || inc.id === 'INC-137';

                return (
                  <tr
                    key={inc.id}
                    onClick={() => onSelectIncident(inc.id)}
                    className="carbon-table-row hover:bg-[#262626] cursor-pointer group transition-colors"
                  >
                    {/* Severity */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <SeverityBadge severity={inc.severity} size="sm" />
                    </td>

                    {/* Incident ID & Title */}
                    <td className="py-3 px-3 max-w-xs">
                      <div className="font-mono text-xs font-bold text-[#F4F4F4] group-hover:text-[#4589FF] transition-colors flex items-center gap-1.5">
                        <span>{inc.id}</span>
                        {inc.id === 'INC-137' && (
                          <span className="text-[10px] font-mono px-1 py-0.2 rounded-xs bg-[#4589FF]/15 text-[#78A9FF] border border-[#4589FF]/30">
                            RECURRING
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#C6C6C6] font-normal truncate mt-0.5">
                        {inc.title}
                      </div>
                    </td>

                    {/* Service & Version */}
                    <td className="py-3 px-3 whitespace-nowrap font-mono text-xs">
                      <div className="text-[#F4F4F4] font-medium">{inc.service}</div>
                      <div className="text-[11px] text-[#8D8D8D]">deploy: {inc.deploymentVersion}</div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded-xs border ${
                        isResolved
                          ? 'bg-[#24A148]/15 text-[#42be65] border-[#24A148]/40'
                          : inc.status === 'INVESTIGATING'
                          ? 'bg-[#0F62FE]/15 text-[#78A9FF] border-[#0F62FE]/40'
                          : 'bg-[#FF832B]/15 text-[#FF832B] border-[#FF832B]/40'
                      }`}>
                        {isResolved ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0F62FE] animate-pulse" />
                        )}
                        <span>{inc.status}</span>
                      </span>
                    </td>

                    {/* Telemetry Signals */}
                    <td className="py-3 px-3 whitespace-nowrap font-mono text-xs">
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="text-[10px] text-[#8D8D8D] mr-1">LAT:</span>
                          <span className={inc.signals.latency > 2 ? 'text-[#FA4D56] font-bold' : 'text-[#C6C6C6]'}>
                            {inc.signals.latency}s
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#8D8D8D] mr-1">ERR:</span>
                          <span className={inc.signals.errorRate > 5 ? 'text-[#FA4D56] font-bold' : 'text-[#C6C6C6]'}>
                            {inc.signals.errorRate}%
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Detected / Duration */}
                    <td className="py-3 px-3 whitespace-nowrap font-mono text-xs text-[#8D8D8D]">
                      <div>{inc.createdAt ? new Date(inc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '14:22 UTC'}</div>
                      <div className="text-[11px] text-[#C6C6C6]">
                        {isResolved ? `Resolved in ${inc.resolution?.duration || '8.2m'}` : 'Active (18m)'}
                      </div>
                    </td>

                    {/* AI Confidence */}
                    <td className="py-3 px-3 whitespace-nowrap font-mono text-xs">
                      <div className="flex items-center gap-1.5">
                        <BrainCircuit className="w-3.5 h-3.5 text-[#4589FF]" />
                        <span className="text-[#F4F4F4] font-medium">{confidence}</span>
                        {hasMemoryMatch && (
                          <span className="text-[10px] text-[#78A9FF] bg-[#4589FF]/10 px-1 py-0.2 rounded-xs border border-[#4589FF]/30">
                            MEM MATCH
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectIncident(inc.id);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xs bg-[#262626] hover:bg-[#333333] border border-[#393939] hover:border-[#525252] text-[#F4F4F4] text-xs font-mono transition-colors"
                      >
                        <span>Investigate</span>
                        <ArrowRight className="w-3 h-3 text-[#8D8D8D] group-hover:text-[#4589FF] group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-8 text-center text-xs font-mono text-[#8D8D8D] space-y-2">
            <div>No incidents match the active filter criteria ({severityFilter !== 'ALL' ? `Severity: ${severityFilter}` : ''} {filter !== 'all' ? `Status: ${filter}` : ''} {search ? `Search: "${search}"` : ''}).</div>
            <div className="flex items-center justify-center gap-2 pt-1">
              {severityFilter !== 'ALL' && (
                <button
                  type="button"
                  onClick={() => setSeverityFilter('ALL')}
                  className="px-2.5 py-1 bg-[#262626] hover:bg-[#333333] border border-[#393939] text-[#78A9FF] rounded-xs transition-colors cursor-pointer"
                >
                  Reset Severity Filter
                </button>
              )}
              {filter !== 'all' && (
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className="px-2.5 py-1 bg-[#262626] hover:bg-[#333333] border border-[#393939] text-[#C6C6C6] rounded-xs transition-colors cursor-pointer"
                >
                  Show All Statuses
                </button>
              )}
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="px-2.5 py-1 bg-[#262626] hover:bg-[#333333] border border-[#393939] text-[#C6C6C6] rounded-xs transition-colors cursor-pointer"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
