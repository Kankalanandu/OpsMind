import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Search, 
  Calendar, 
  Network, 
  Filter, 
  CheckCircle2
} from 'lucide-react';
import { HistoricalMemory, HindsightStatus } from '../types/index.ts';

interface MemoryExplorerViewProps {
  onSelectMemory?: (mem: HistoricalMemory) => void;
  hindsightStatus?: HindsightStatus | null;
}

export const MemoryExplorerView: React.FC<MemoryExplorerViewProps> = ({
  onSelectMemory,
  hindsightStatus
}) => {
  const [query, setQuery] = useState('database connection failure');
  const [filterType, setFilterType] = useState<'all' | 'experience' | 'observation' | 'root_causes' | 'resolutions'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'network' | 'timeline'>('cards');
  const [memories, setMemories] = useState<HistoricalMemory[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>('INC-104');

  useEffect(() => {
    handleSearch(query);
  }, []);

  const handleSearch = async (searchTerm: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/memory/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      if (data.memories) {
        setMemories(data.memories);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const filteredMemories = memories.filter(mem => {
    if (filterType === 'all') return true;
    if (filterType === 'experience') return mem.type === 'experience';
    if (filterType === 'observation') return mem.type === 'observation';
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5 animate-carbon-reveal">
      {/* 1. Page Header (Carbon Standard) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#393939]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-[#F4F4F4] tracking-tight">
              Organizational Memory Bank
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-xs bg-[#4589FF]/15 text-[#78A9FF] border border-[#4589FF]/40">
              HINDSIGHT: {hindsightStatus?.bankId || 'OpsMind'}
            </span>
          </div>
          <p className="text-xs text-[#C6C6C6] mt-0.5">
            Operational intelligence, root-cause signatures, and validated remediation procedures retained in persistent memory.
          </p>
        </div>

        {/* View Mode Toggle (Carbon Standard) */}
        <div className="flex items-center bg-[#262626] p-0.5 rounded-xs border border-[#393939] text-xs font-mono self-start sm:self-center">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1 transition-colors ${
              viewMode === 'cards' 
                ? 'bg-[#393939] text-[#F4F4F4] font-semibold border-b-2 border-[#0F62FE]' 
                : 'text-[#8D8D8D] hover:text-[#C6C6C6]'
            }`}
          >
            Memory Units
          </button>
          <button
            onClick={() => setViewMode('network')}
            className={`px-3 py-1 transition-colors ${
              viewMode === 'network' 
                ? 'bg-[#393939] text-[#F4F4F4] font-semibold border-b-2 border-[#0F62FE]' 
                : 'text-[#8D8D8D] hover:text-[#C6C6C6]'
            }`}
          >
            Knowledge Graph
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1 transition-colors ${
              viewMode === 'timeline' 
                ? 'bg-[#393939] text-[#F4F4F4] font-semibold border-b-2 border-[#0F62FE]' 
                : 'text-[#8D8D8D] hover:text-[#C6C6C6]'
            }`}
          >
            Timeline
          </button>
        </div>
      </div>

      {/* 2. Enterprise Memory Stats (Carbon Standard 5-Column Grid) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 font-mono text-xs">
        <div className="carbon-panel p-3.5 space-y-1">
          <div className="text-[10px] text-[#8D8D8D] uppercase tracking-wider">Total Units</div>
          <div className="text-2xl font-bold text-[#4589FF]">284</div>
          <div className="text-[11px] text-[#8D8D8D]">Hindsight Units</div>
        </div>

        <div className="carbon-panel p-3.5 space-y-1">
          <div className="text-[10px] text-[#8D8D8D] uppercase tracking-wider">Incidents Indexed</div>
          <div className="text-2xl font-bold text-[#F4F4F4]">76</div>
          <div className="text-[11px] text-[#8D8D8D]">Production Events</div>
        </div>

        <div className="carbon-panel p-3.5 space-y-1">
          <div className="text-[10px] text-[#8D8D8D] uppercase tracking-wider">Root Causes</div>
          <div className="text-2xl font-bold text-[#F1C21B]">41</div>
          <div className="text-[11px] text-[#8D8D8D]">Signatures</div>
        </div>

        <div className="carbon-panel p-3.5 space-y-1">
          <div className="text-[10px] text-[#8D8D8D] uppercase tracking-wider">Validated Fixes</div>
          <div className="text-2xl font-bold text-[#24A148]">93</div>
          <div className="text-[11px] text-[#8D8D8D]">Action Recipes</div>
        </div>

        <div className="carbon-panel p-3.5 space-y-1 col-span-2 md:col-span-1">
          <div className="text-[10px] text-[#8D8D8D] uppercase tracking-wider">Patterns Avoided</div>
          <div className="text-2xl font-bold text-[#F4F4F4]">31</div>
          <div className="text-[11px] text-[#8D8D8D]">Systemic Insights</div>
        </div>
      </div>

      {/* 3. Semantic Search Bar (Carbon Standard Input) */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Semantic Recall: e.g. What have we learned about database connection failures or Payments API?"
          className="w-full pl-9 pr-28 py-2.5 bg-[#262626] border border-[#393939] focus:border-[#0F62FE] rounded-xs text-xs font-mono text-[#F4F4F4] placeholder-[#8D8D8D] outline-none transition-colors"
        />
        <Search className="w-4 h-4 text-[#8D8D8D] absolute left-3 top-3" />
        <button
          type="submit"
          disabled={loading}
          className="absolute right-1.5 top-1.5 px-3 py-1 rounded-xs bg-[#0F62FE] hover:bg-[#0353E9] active:bg-[#0043CE] text-white text-xs font-mono transition-colors cursor-pointer"
        >
          {loading ? 'Recalling...' : 'Recall'}
        </button>
      </form>

      {/* VIEW MODE 1: MEMORY CARDS */}
      {viewMode === 'cards' && (
        <div className="space-y-4">
          {/* Quick Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
            <span className="text-[#8D8D8D] font-medium flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[#8D8D8D]" /> Filter:
            </span>
            {(['all', 'experience', 'observation'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilterType(tab)}
                className={`px-2.5 py-0.5 rounded-xs capitalize transition-colors ${
                  filterType === tab
                    ? 'bg-[#393939] text-[#F4F4F4] border border-[#525252] font-semibold'
                    : 'bg-[#262626] text-[#8D8D8D] border border-[#393939] hover:bg-[#333333] hover:text-[#C6C6C6]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredMemories.map(mem => (
              <div
                key={mem.id}
                className="carbon-panel p-4 space-y-3 relative border-l-2 border-l-[#4589FF]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#F4F4F4]">{mem.incidentId}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-xs bg-[#161616] text-[#C6C6C6] border border-[#393939]">
                      {mem.service}
                    </span>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-xs bg-[#4589FF]/15 text-[#78A9FF] border border-[#4589FF]/40 font-semibold">
                    {mem.similarity}% match
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-[#F4F4F4]">{mem.title}</h3>

                <div className="space-y-1.5 text-xs font-mono">
                  <div className="text-[#C6C6C6]">
                    <span className="text-[#8D8D8D] uppercase text-[10px]">Root Cause: </span>
                    <span>{mem.rootCause}</span>
                  </div>
                  <div className="text-[#42be65] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Validated Fix: {mem.successfulAction}</span>
                  </div>
                  {mem.failedActions.length > 0 && (
                    <div className="text-[#FA4D56] text-[11px]">
                      <span>✕ Ineffective attempt: {mem.failedActions[0]}</span>
                    </div>
                  )}
                </div>

                <div className="p-2.5 rounded-xs bg-[#1f2533] border border-[#4589FF]/30 text-xs text-[#EDF5FF] leading-relaxed">
                  <span className="font-semibold text-[#78A9FF] mr-1">Lesson:</span>
                  <span>"{mem.lesson}"</span>
                </div>

                <div className="pt-2 border-t border-[#393939] flex items-center justify-between text-[11px] font-mono text-[#8D8D8D]">
                  <span>Deploy: <strong className="text-[#C6C6C6]">{mem.deploymentVersion}</strong></span>
                  <span>{new Date(mem.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: VISUAL MEMORY NETWORK */}
      {viewMode === 'network' && (
        <div className="carbon-panel p-4 space-y-3">
          <div className="flex items-center justify-between text-xs border-b border-[#393939] pb-2">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-[#4589FF]" />
              <span className="font-bold text-[#F4F4F4] font-mono">Interactive Incident Knowledge Graph</span>
            </div>
            <span className="text-[#8D8D8D] font-mono text-[11px]">
              Select a node to inspect relationships & evidence
            </span>
          </div>

          {/* SVG Knowledge Graph */}
          <div className="w-full h-80 bg-[#161616] rounded-xs border border-[#393939] relative flex items-center justify-center overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 800 400">
              {/* Connecting Lines */}
              <line x1="140" y1="200" x2="300" y2="120" stroke="#4589FF" strokeWidth="1.5" strokeDasharray="4 2" />
              <line x1="140" y1="200" x2="300" y2="280" stroke="#4589FF" strokeWidth="1.5" />
              <line x1="300" y1="120" x2="500" y2="120" stroke="#525252" strokeWidth="1.5" />
              <line x1="300" y1="280" x2="500" y2="280" stroke="#525252" strokeWidth="1.5" />
              <line x1="500" y1="120" x2="680" y2="200" stroke="#24A148" strokeWidth="1.5" />
              <line x1="500" y1="280" x2="680" y2="200" stroke="#24A148" strokeWidth="1.5" />
              <line x1="300" y1="120" x2="300" y2="280" stroke="#78A9FF" strokeWidth="1" strokeDasharray="3 3" />

              {/* Nodes */}
              <g onClick={() => setSelectedNode('INC-104')} className="cursor-pointer">
                <circle cx="140" cy="200" r="28" fill="#1e2638" stroke="#4589FF" strokeWidth="2" />
                <text x="140" y="196" textAnchor="middle" fill="#78A9FF" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="bold">INC-104</text>
                <text x="140" y="210" textAnchor="middle" fill="#8D8D8D" fontSize="8" fontFamily="IBM Plex Mono">SEV-1</text>
              </g>

              <g onClick={() => setSelectedNode('CAUSE')} className="cursor-pointer">
                <circle cx="300" cy="120" r="28" fill="#2d1c1e" stroke="#DA1E28" strokeWidth="2" />
                <text x="300" y="116" textAnchor="middle" fill="#FA4D56" fontSize="8" fontFamily="IBM Plex Mono" fontWeight="bold">CONN LEAK</text>
                <text x="300" y="130" textAnchor="middle" fill="#8D8D8D" fontSize="8" fontFamily="IBM Plex Mono">Root Cause</text>
              </g>

              <g onClick={() => setSelectedNode('SERVICE')} className="cursor-pointer">
                <circle cx="300" cy="280" r="28" fill="#1c2333" stroke="#0F62FE" strokeWidth="2" />
                <text x="300" y="276" textAnchor="middle" fill="#A6C8FF" fontSize="8" fontFamily="IBM Plex Mono" fontWeight="bold">PAYMENTS</text>
                <text x="300" y="290" textAnchor="middle" fill="#8D8D8D" fontSize="8" fontFamily="IBM Plex Mono">Service</text>
              </g>

              <g onClick={() => setSelectedNode('DEPLOY')} className="cursor-pointer">
                <circle cx="500" cy="120" r="28" fill="#262626" stroke="#525252" strokeWidth="2" />
                <text x="500" y="116" textAnchor="middle" fill="#F4F4F4" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="bold">v4.2.1 / v4.2.3</text>
                <text x="500" y="130" textAnchor="middle" fill="#8D8D8D" fontSize="8" fontFamily="IBM Plex Mono">Deploy</text>
              </g>

              <g onClick={() => setSelectedNode('POOL')} className="cursor-pointer">
                <circle cx="500" cy="280" r="28" fill="#2e2617" stroke="#F1C21B" strokeWidth="2" />
                <text x="500" y="276" textAnchor="middle" fill="#F1C21B" fontSize="8" fontFamily="IBM Plex Mono" fontWeight="bold">POOL 96%</text>
                <text x="500" y="290" textAnchor="middle" fill="#8D8D8D" fontSize="8" fontFamily="IBM Plex Mono">Symptom</text>
              </g>

              <g onClick={() => setSelectedNode('RESOLVE')} className="cursor-pointer">
                <circle cx="680" cy="200" r="30" fill="#19281e" stroke="#24A148" strokeWidth="2" />
                <text x="680" y="196" textAnchor="middle" fill="#42be65" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="bold">ROLLBACK</text>
                <text x="680" y="210" textAnchor="middle" fill="#8D8D8D" fontSize="8" fontFamily="IBM Plex Mono">Validated Fix</text>
              </g>
            </svg>
          </div>

          {/* Selected Node Details Bar */}
          <div className="p-3 rounded-xs bg-[#161616] border border-[#393939] text-xs font-mono flex items-center justify-between text-[#C6C6C6]">
            <div>
              <span className="text-[#4589FF] font-bold">Selected Node: </span>
              {selectedNode === 'INC-104' && 'INC-104 (Payments API latency spike, August 14)'}
              {selectedNode === 'CAUSE' && 'Connection leak in webhook error branch (unreleased pool client)'}
              {selectedNode === 'SERVICE' && 'Payments API microservice (Fleet: 6 ECS pods, Postgres pool)'}
              {selectedNode === 'DEPLOY' && 'Deployments v4.2.1 & v4.2.3 introduced webhook connection leaks'}
              {selectedNode === 'POOL' && 'Database connection pool reached 96% saturation within 11 minutes'}
              {selectedNode === 'RESOLVE' && 'Rollback deployment immediately freed connection pool within 4 minutes'}
            </div>
            <span className="text-[#42be65] font-semibold text-[11px]">Indexed in Hindsight</span>
          </div>
        </div>
      )}

      {/* VIEW MODE 3: KNOWLEDGE TIMELINE */}
      {viewMode === 'timeline' && (
        <div className="carbon-panel p-4 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#F4F4F4] font-mono border-b border-[#393939] pb-2">
            <Calendar className="w-4 h-4 text-[#4589FF]" />
            <span>Operational Knowledge Accumulation (June → September)</span>
          </div>

          <div className="space-y-2">
            {[
              { month: 'June', count: '12 Learnings', title: 'Ledger table query statement timeout indexed', id: 'INC-061' },
              { month: 'July', count: '18 Learnings', title: 'PgBouncer session vs transaction pooling transition', id: 'INC-087' },
              { month: 'August', count: '24 Learnings', title: 'Payments webhook connection leak & rollback rule', id: 'INC-104' },
              { month: 'September', count: '31 Learnings', title: 'Redis failover allkeys-lru eviction policy stored', id: 'INC-118' }
            ].map((milestone, idx) => (
              <div key={idx} className="flex items-start gap-4 p-3 rounded-xs bg-[#1e1e1e] border border-[#393939]">
                <div className="w-24 font-mono text-xs text-[#78A9FF] font-bold">{milestone.month}</div>
                <div className="flex-1 space-y-0.5 text-xs">
                  <div className="font-semibold text-[#F4F4F4]">{milestone.title}</div>
                  <div className="text-[11px] text-[#8D8D8D] font-mono">Incident {milestone.id} • {milestone.count} retained</div>
                </div>
                <span className="text-[10px] font-mono text-[#42be65] bg-[#24a148]/10 border border-[#24a148]/30 px-2 py-0.5 rounded-xs font-bold">
                  Validated
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
