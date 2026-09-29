import React from 'react';
import { 
  X, 
  RotateCcw, 
  Play, 
  CheckCircle2, 
  Database, 
  BrainCircuit, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface DemoControlsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onResetDemo: () => Promise<void>;
  onLoadIncident1: () => void;
  onResolveIncident1: () => Promise<void>;
  onRetainLearningIncident1: () => Promise<void>;
  onLoadIncident2: () => void;
  onInvestigateIncident2: () => void;
}

export const DemoControlsDrawer: React.FC<DemoControlsDrawerProps> = ({
  isOpen,
  onClose,
  onResetDemo,
  onLoadIncident1,
  onResolveIncident1,
  onRetainLearningIncident1,
  onLoadIncident2,
  onInvestigateIncident2
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-80 md:w-96 bg-[#161616] border-l border-[#393939] shadow-2xl p-5 flex flex-col justify-between animate-carbon-reveal select-none">
      <div className="space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#393939]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#4589FF]" />
            <h3 className="text-xs font-bold text-[#F4F4F4] font-mono uppercase tracking-wider">
              Demo Script Controller
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="w-7 h-7 rounded-xs bg-[#262626] hover:bg-[#333333] text-[#C6C6C6] hover:text-[#F4F4F4] flex items-center justify-center border border-[#393939] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#C6C6C6] leading-relaxed">
          Execute the two-incident demonstration step-by-step to evaluate self-learning incident response with Hindsight persistent memory.
        </p>

        {/* Step-by-step Execution Buttons */}
        <div className="space-y-2.5 font-mono text-xs">
          {/* Step 1: Load Incident 1 */}
          <button
            onClick={() => {
              onLoadIncident1();
              onClose();
            }}
            className="w-full p-3 rounded-xs bg-[#262626] hover:bg-[#333333] border border-[#393939] hover:border-[#525252] text-left transition-colors group flex items-center justify-between cursor-pointer"
          >
            <div>
              <div className="text-[10px] text-[#8D8D8D]">STAGE 1</div>
              <div className="font-semibold text-[#F4F4F4]">1. Load Incident 1 (INC-104)</div>
              <div className="text-[11px] text-[#8D8D8D]">First time connection leak</div>
            </div>
            <Play className="w-4 h-4 text-[#8D8D8D] group-hover:text-[#4589FF]" />
          </button>

          {/* Step 2: Resolve Incident 1 */}
          <button
            onClick={async () => {
              await onResolveIncident1();
            }}
            className="w-full p-3 rounded-xs bg-[#262626] hover:bg-[#333333] border border-[#393939] hover:border-[#525252] text-left transition-colors group flex items-center justify-between cursor-pointer"
          >
            <div>
              <div className="text-[10px] text-[#42be65]">STAGE 2</div>
              <div className="font-semibold text-[#F4F4F4]">2. Resolve INC-104</div>
              <div className="text-[11px] text-[#8D8D8D]">Rollback deployment v4.2.1</div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-[#8D8D8D] group-hover:text-[#42be65]" />
          </button>

          {/* Step 3: Retain Memory to Hindsight */}
          <button
            onClick={async () => {
              await onRetainLearningIncident1();
            }}
            className="w-full p-3 rounded-xs bg-[#262626] hover:bg-[#333333] border border-[#393939] hover:border-[#525252] text-left transition-colors group flex items-center justify-between cursor-pointer"
          >
            <div>
              <div className="text-[10px] text-[#78A9FF]">STAGE 3</div>
              <div className="font-semibold text-[#F4F4F4]">3. Retain to Hindsight</div>
              <div className="text-[11px] text-[#8D8D8D]">Store connection leak lesson</div>
            </div>
            <Database className="w-4 h-4 text-[#8D8D8D] group-hover:text-[#4589FF]" />
          </button>

          {/* Step 4: Load Incident 2 */}
          <button
            onClick={() => {
              onLoadIncident2();
              onClose();
            }}
            className="w-full p-3 rounded-xs bg-[#1e2638] hover:bg-[#253147] border border-[#4589FF]/40 text-left transition-colors group flex items-center justify-between cursor-pointer"
          >
            <div>
              <div className="text-[10px] text-[#78A9FF] font-bold">STAGE 4 (THE CLIMAX)</div>
              <div className="font-semibold text-[#F4F4F4]">4. Load Incident 2 (INC-137)</div>
              <div className="text-[11px] text-[#C6C6C6]">Recalls INC-104 & reasons</div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#4589FF] group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Step 5: Investigate Incident 2 */}
          <button
            onClick={() => {
              onInvestigateIncident2();
              onClose();
            }}
            className="w-full p-3 rounded-xs bg-[#0F62FE] hover:bg-[#0353E9] active:bg-[#0043CE] text-white font-medium text-left transition-colors group flex items-center justify-between cursor-pointer"
          >
            <div>
              <div className="text-[10px] text-[#D0E2FF]">STAGE 5</div>
              <div className="font-semibold">5. Run AI Investigation</div>
              <div className="text-[11px] text-[#D0E2FF]/80">Recall 91% memory similarity</div>
            </div>
            <BrainCircuit className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Reset Demo Button */}
      <div className="pt-4 border-t border-[#393939] space-y-2">
        <button
          onClick={async () => {
            await onResetDemo();
            onClose();
          }}
          className="w-full py-2 px-3 rounded-xs bg-[#262626] hover:bg-[#333333] border border-[#393939] hover:border-[#DA1E28]/40 text-[#C6C6C6] hover:text-[#FA4D56] text-xs font-mono flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo to Baseline</span>
        </button>
        <div className="text-[10px] text-center text-[#8D8D8D] font-mono">
          OpsMind SRE Incident Command Center
        </div>
      </div>
    </div>
  );
};
