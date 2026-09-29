import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Database, 
  Clock, 
  ShieldAlert, 
  RotateCcw,
  ArrowLeft, 
  Check
} from 'lucide-react';
import { PostMortem, HindsightStatus } from '../types/index.ts';

interface PostMortemViewProps {
  postMortem: PostMortem;
  onBack: () => void;
  onRetainToHindsight: (incidentId: string) => Promise<any>;
  hindsightStatus?: HindsightStatus | null;
}

export const PostMortemView: React.FC<PostMortemViewProps> = ({
  postMortem,
  onBack,
  onRetainToHindsight,
  hindsightStatus
}) => {
  const [retaining, setRetaining] = useState(false);
  const [isRetained, setIsRetained] = useState(postMortem.retainedInHindsight);

  const handleRetain = async () => {
    setRetaining(true);
    try {
      await onRetainToHindsight(postMortem.incidentId);
      setIsRetained(true);
    } catch (err) {
      console.error('Retain error:', err);
    } finally {
      setRetaining(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5 animate-carbon-reveal">
      {/* 1. Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#393939]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-xs bg-[#262626] border border-[#393939] hover:border-[#525252] text-[#C6C6C6] hover:text-[#F4F4F4] transition-colors cursor-pointer"
            title="Back to Overview"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#4589FF]">{postMortem.id}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-xs bg-[#DA1E28]/15 text-[#FA4D56] border border-[#DA1E28]/40 font-bold">
                {postMortem.severity}
              </span>
              <span className="text-xs text-[#8D8D8D] font-mono">Service: {postMortem.service}</span>
            </div>
            <h1 className="text-lg font-semibold text-[#F4F4F4] mt-0.5">{postMortem.title}</h1>
          </div>
        </div>

        <div>
          {isRetained ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xs bg-[#24A148]/15 border border-[#24A148]/40 text-[#42be65] text-xs font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>✓ Retained in Hindsight</span>
            </div>
          ) : (
            <button
              onClick={handleRetain}
              disabled={retaining}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xs bg-[#0F62FE] hover:bg-[#0353E9] active:bg-[#0043CE] disabled:opacity-50 text-white font-medium text-xs font-mono transition-colors cursor-pointer"
            >
              {retaining ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  <span>Retaining to Hindsight...</span>
                </>
              ) : (
                <>
                  <Database className="w-3.5 h-3.5" />
                  <span>Save Learning to Hindsight</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Retained Notification Banner */}
      {isRetained && (
        <div className="p-3 rounded-xs bg-[#24A148]/10 border border-[#24A148]/30 text-xs font-mono text-[#42be65] flex items-center justify-between">
          <span>✓ Memory retained into bank {hindsightStatus?.bankId || 'OpsMind'}. Available for future AI investigations.</span>
          <span className="text-[11px] text-[#8D8D8D]">Hindsight Store</span>
        </div>
      )}

      {/* Structured Post-Mortem Document */}
      <div className="carbon-panel p-6 space-y-5 text-xs text-[#C6C6C6]">
        {/* Executive Summary */}
        <div className="space-y-1.5">
          <h2 className="text-xs font-bold text-[#4589FF] font-mono uppercase tracking-wider">
            1. Executive Summary & Impact
          </h2>
          <p className="leading-relaxed text-[#F4F4F4]">
            {postMortem.impact} Total incident duration from detection to verification was {postMortem.duration}. All core checkout workflows returned to nominal SLA after deployment rollback.
          </p>
        </div>

        {/* Root Cause */}
        <div className="space-y-1.5">
          <h2 className="text-xs font-bold text-[#4589FF] font-mono uppercase tracking-wider">
            2. Root Cause Analysis
          </h2>
          <div className="p-3 rounded-xs bg-[#161616] border border-[#393939] leading-relaxed text-[#F4F4F4] font-mono">
            {postMortem.rootCause}
          </div>
        </div>

        {/* Actions Attempted: Worked vs Failed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xs bg-[#DA1E28]/10 border border-[#DA1E28]/30 space-y-1.5">
            <h3 className="text-xs font-bold text-[#FA4D56] font-mono uppercase tracking-wider">
              ✕ Ineffective Actions (Avoid in future)
            </h3>
            <p className="text-[#C6C6C6] leading-relaxed text-[11px]">
              {postMortem.whatFailed}
            </p>
          </div>

          <div className="p-3.5 rounded-xs bg-[#24A148]/10 border border-[#24A148]/30 space-y-1.5">
            <h3 className="text-xs font-bold text-[#42be65] font-mono uppercase tracking-wider">
              ✓ Validated Resolution
            </h3>
            <p className="text-[#C6C6C6] leading-relaxed text-[11px]">
              {postMortem.whatWorked}
            </p>
          </div>
        </div>

        {/* Contributing Factors */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-[#4589FF] font-mono uppercase tracking-wider">
            3. Contributing Factors
          </h2>
          <div className="space-y-1">
            {postMortem.contributingFactors.map((factor, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="font-mono text-[#4589FF]">•</span>
                <span className="text-[#F4F4F4]">{factor}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lessons Learned */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-[#4589FF] font-mono uppercase tracking-wider">
            4. Lessons Learned (Retained into Hindsight)
          </h2>
          <div className="space-y-1.5">
            {postMortem.lessonsLearned.map((lesson, idx) => (
              <div key={idx} className="p-2.5 rounded-xs bg-[#1f2533] border border-[#4589FF]/30 text-[#EDF5FF]">
                <span className="text-[#78A9FF] font-semibold mr-1">Lesson:</span>
                <span>"{lesson}"</span>
              </div>
            ))}
          </div>
        </div>

        {/* Preventive Actions */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-[#4589FF] font-mono uppercase tracking-wider">
            5. Preventive Actions & Engineering Tasks
          </h2>
          <div className="space-y-1 font-mono text-[11px]">
            {postMortem.preventiveActions.map((action, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 rounded-xs bg-[#161616] border border-[#393939] text-[#F4F4F4]">
                <Check className="w-3.5 h-3.5 text-[#24A148]" />
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
