import React, { useState } from 'react';
import { 
  X, 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  RotateCcw
} from 'lucide-react';
import { HindsightStatus } from '../types/index.ts';

interface HindsightStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: HindsightStatus | null;
  onRefreshStatus: () => Promise<void>;
  onOpenMemoryExplorer: () => void;
}

export const HindsightStatusModal: React.FC<HindsightStatusModalProps> = ({
  isOpen,
  onClose,
  status,
  onRefreshStatus,
  onOpenMemoryExplorer
}) => {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/memory/test', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setTestResult('Successfully verified connection to Hindsight cluster and memory bank.');
      } else {
        setTestResult('Hindsight connection test offline. Operating in Demo Memory Mode (Fallback).');
      }
      await onRefreshStatus();
    } catch (err: any) {
      setTestResult(`Test failed: ${err.message}`);
    } finally {
      setTesting(false);
    }
  };

  const isConnected = status?.connected;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-carbon-reveal select-none">
      <div className="bg-[#262626] border border-[#525252] rounded-xs max-w-lg w-full p-5 space-y-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#393939]">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-xs bg-[#4589FF]/15 border border-[#4589FF]/40 flex items-center justify-center text-[#78A9FF]">
              <Database className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-[#F4F4F4] font-mono uppercase tracking-wider">
                Hindsight Memory Status
              </h2>
              <p className="text-[10px] text-[#8D8D8D] font-mono">Semantic Incident Intelligence Bank</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-7 h-7 rounded-xs bg-[#161616] hover:bg-[#333333] text-[#C6C6C6] hover:text-[#F4F4F4] flex items-center justify-center border border-[#393939] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Status Badge */}
        <div className={`p-3 rounded-xs border flex items-center justify-between ${
          isConnected
            ? 'bg-[#24A148]/10 border-[#24A148]/40 text-[#42be65]'
            : 'bg-[#F1C21B]/10 border-[#F1C21B]/40 text-[#F1C21B]'
        }`}>
          <div className="flex items-center gap-2.5">
            {isConnected ? (
              <CheckCircle2 className="w-4 h-4 text-[#24A148] shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-[#F1C21B] shrink-0" />
            )}
            <div>
              <div className="text-xs font-bold font-mono">
                {isConnected ? '● Hindsight Live Connected' : 'Demo memory mode — Hindsight connection unavailable.'}
              </div>
              <div className="text-[11px] text-[#8D8D8D] font-mono mt-0.5">
                {isConnected 
                  ? 'Connected to official @vectorize-io/hindsight-client'
                  : 'Operating in graceful fallback development mode (local semantic incident repository)'}
              </div>
            </div>
          </div>

          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-xs bg-[#161616] border border-[#393939]">
            {isConnected ? 'ONLINE' : 'FALLBACK'}
          </span>
        </div>

        {/* Configuration Details Table */}
        <div className="p-3.5 rounded-xs bg-[#161616] border border-[#393939] space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#8D8D8D]">MEMORY BANK ID:</span>
            <span className="text-[#4589FF] font-bold">{status?.bankId || 'OpsMind'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#8D8D8D]">BASE URL:</span>
            <span className="text-[#C6C6C6] text-[11px] truncate max-w-[200px]">{status?.baseUrl || 'https://api.hindsight.vectorize.io'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#8D8D8D]">INDEXED MEMORIES:</span>
            <span className="text-[#F4F4F4] font-bold">{status?.totalMemories || 284}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#8D8D8D]">LAST RECALL:</span>
            <span className="text-[#C6C6C6] text-[11px]">
              {status?.lastRecall ? new Date(status.lastRecall).toLocaleTimeString() : '32 sec ago'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#8D8D8D]">LAST RETAIN:</span>
            <span className="text-[#C6C6C6] text-[11px]">
              {status?.lastRetain ? new Date(status.lastRetain).toLocaleTimeString() : '2 min ago'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#8D8D8D]">LAST REFLECT:</span>
            <span className="text-[#C6C6C6] text-[11px]">
              {status?.lastReflect ? new Date(status.lastReflect).toLocaleTimeString() : '1 min ago'}
            </span>
          </div>
        </div>

        {/* Test Result Message */}
        {testResult && (
          <div className="p-2.5 rounded-xs bg-[#1e2638] border border-[#4589FF]/40 text-xs font-mono text-[#EDF5FF]">
            {testResult}
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#393939]">
          <button
            onClick={() => {
              onClose();
              onOpenMemoryExplorer();
            }}
            className="px-3 py-1.5 rounded-xs bg-[#161616] hover:bg-[#333333] text-[#C6C6C6] hover:text-[#F4F4F4] font-mono text-xs border border-[#393939] transition-colors cursor-pointer"
          >
            Open Memory Explorer
          </button>

          <button
            onClick={handleTest}
            disabled={testing}
            className="px-3.5 py-1.5 rounded-xs bg-[#0F62FE] hover:bg-[#0353E9] active:bg-[#0043CE] disabled:opacity-50 text-white font-medium font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {testing ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            <span>Test Connection</span>
          </button>
        </div>
      </div>
    </div>
  );
};
