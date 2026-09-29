import React, { useState } from 'react';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  AlertOctagon, 
  Database, 
  BrainCircuit, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw,
  TrendingDown,
  Layers,
  ShieldCheck,
  Zap,
  X
} from 'lucide-react';

import { HistoricalMemory, HindsightStatus } from '../types/index.ts';

interface JuryModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToIncident: (id: string) => void;
  hindsightStatus?: HindsightStatus | null;
}

export const JuryModeModal: React.FC<JuryModeModalProps> = ({
  isOpen,
  onClose,
  onJumpToIncident,
  hindsightStatus
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const bankName = hindsightStatus?.bankId || 'OpsMind';

  if (!isOpen) return null;

  const totalSteps = 10;

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex flex-col justify-between overflow-y-auto p-4 md:p-8 animate-carbon-reveal select-none">
      <div className="max-w-4xl w-full mx-auto bg-[#161616] border border-[#393939] rounded-xs shadow-2xl p-6 flex flex-col justify-between min-h-[580px]">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#393939]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xs bg-[#0F62FE] flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#F4F4F4] tracking-wider font-mono">OPSMIND</span>
                <span className="text-[10px] font-mono uppercase bg-[#4589FF]/15 text-[#78A9FF] border border-[#4589FF]/40 px-1.5 py-0.2 rounded-xs font-bold">
                  JURY WALKTHROUGH (60-90s)
                </span>
              </div>
              <p className="text-[11px] text-[#8D8D8D]">Self-Learning Incident Intelligence Flow</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-xs bg-[#262626] hover:bg-[#333333] text-[#C6C6C6] hover:text-[#F4F4F4] flex items-center justify-center border border-[#393939] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="my-3">
          <div className="flex items-center justify-between gap-1 mb-2">
            {Array.from({ length: totalSteps }).map((_, i) => {
              const stepNum = i + 1;
              const isCompleted = stepNum < currentStep;
              const isCurrent = stepNum === currentStep;
              return (
                <div
                  key={stepNum}
                  onClick={() => setCurrentStep(stepNum)}
                  className={`flex-1 h-1 rounded-xs transition-colors cursor-pointer ${
                    isCurrent
                      ? 'bg-[#0F62FE]'
                      : isCompleted
                      ? 'bg-[#4589FF]/50'
                      : 'bg-[#262626]'
                  }`}
                  title={`Step ${stepNum}`}
                />
              );
            })}
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-[#8D8D8D]">
            <span>Step {currentStep} of {totalSteps}</span>
            <span className="text-[#4589FF] uppercase tracking-wider font-semibold">
              {currentStep <= 2 ? '1. DETECTION' :
               currentStep <= 4 ? '2. RECALL' :
               currentStep <= 6 ? '3. REASONING' :
               currentStep <= 8 ? '4. RESOLUTION' :
               '5. RETENTION'}
            </span>
          </div>
        </div>

        {/* Dynamic Screen Content */}
        <div className="my-auto py-4">
          {/* SCREEN 1: Incident Detected */}
          {currentStep === 1 && (
            <div className="space-y-4 text-center animate-carbon-reveal max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-xs bg-[#DA1E28]/15 border border-[#DA1E28]/40 flex items-center justify-center mx-auto text-[#FA4D56]">
                <AlertOctagon className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-mono uppercase tracking-wider text-[#FA4D56] bg-[#DA1E28]/15 border border-[#DA1E28]/40 px-2 py-0.5 rounded-xs font-medium">
                  CRITICAL ALERT • SEV-1
                </span>
                <h2 className="text-xl font-semibold text-[#F4F4F4]">
                  Production Incident Detected
                </h2>
                <p className="text-xs text-[#C6C6C6]">
                  Payments API telemetry reports 5.1s latency, 16% error rate, and 94% PostgreSQL pool saturation.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 font-mono text-xs text-left">
                <div className="p-3 rounded-xs bg-[#262626] border border-[#393939]">
                  <div className="text-[10px] text-[#8D8D8D]">P99 LATENCY</div>
                  <div className="text-base font-bold text-[#FA4D56]">5.1s</div>
                </div>
                <div className="p-3 rounded-xs bg-[#262626] border border-[#393939]">
                  <div className="text-[10px] text-[#8D8D8D]">ERROR RATE</div>
                  <div className="text-base font-bold text-[#FA4D56]">16%</div>
                </div>
                <div className="p-3 rounded-xs bg-[#262626] border border-[#393939]">
                  <div className="text-[10px] text-[#8D8D8D]">DB POOL</div>
                  <div className="text-base font-bold text-[#FA4D56]">94%</div>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 2: Evidence Synthesis */}
          {currentStep === 2 && (
            <div className="space-y-4 text-center animate-carbon-reveal max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-xs bg-[#0F62FE]/15 border border-[#0F62FE]/40 flex items-center justify-center mx-auto text-[#4589FF]">
                <BrainCircuit className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-mono uppercase tracking-wider text-[#78A9FF] bg-[#0F62FE]/15 border border-[#0F62FE]/40 px-2 py-0.5 rounded-xs font-medium">
                  OPSMIND AGENT ACTIVATION
                </span>
                <h2 className="text-xl font-semibold text-[#F4F4F4]">
                  OpsMind Evaluates Telemetry Signatures
                </h2>
                <p className="text-xs text-[#C6C6C6]">
                  Rather than treating this as an isolated event, the agent extracts service symptoms and release chronology.
                </p>
              </div>

              <div className="p-4 rounded-xs bg-[#262626] border border-[#393939] text-left text-xs space-y-1.5 font-mono">
                <div className="text-[#C6C6C6]">• Service: <span className="text-[#F4F4F4] font-medium">Payments API</span></div>
                <div className="text-[#C6C6C6]">• Release: <span className="text-[#4589FF]">v4.2.3 deployed 12 minutes ago</span></div>
                <div className="text-[#C6C6C6]">• Diagnosis: <span className="text-[#F1C21B]">PostgreSQL connection exhaustion</span></div>
                <div className="text-[#C6C6C6]">• Affected Checkout Users: <span className="text-[#FA4D56]">28%</span></div>
              </div>
            </div>
          )}

          {/* SCREEN 3: Hindsight Query */}
          {currentStep === 3 && (
            <div className="space-y-4 text-center animate-carbon-reveal max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-xs bg-[#4589FF]/15 border border-[#4589FF]/40 flex items-center justify-center mx-auto text-[#4589FF]">
                <Database className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-mono uppercase tracking-wider text-[#78A9FF] bg-[#4589FF]/15 border border-[#4589FF]/40 px-2 py-0.5 rounded-xs font-medium">
                  HINDSIGHT RECALL
                </span>
                <h2 className="text-xl font-semibold text-[#F4F4F4]">
                  Querying Organizational Memory
                </h2>
                <p className="text-xs text-[#C6C6C6]">
                  OpsMind invokes <span className="font-mono text-[#4589FF]">client.recall()</span> against memory bank <span className="font-mono text-[#4589FF]">{bankName}</span>.
                </p>
              </div>

              <div className="p-4 rounded-xs bg-[#161616] border border-[#393939] text-left font-mono text-xs text-[#78A9FF] space-y-1.5">
                <div className="text-[#8D8D8D]">// Semantic recall vector query:</div>
                <div className="text-[#F4F4F4]">"Find previous production incidents involving Payments API, elevated latency, 5xx errors, and DB connection pool saturation."</div>
              </div>
            </div>
          )}

          {/* SCREEN 4: Historical Memory Found */}
          {currentStep === 4 && (
            <div className="space-y-4 text-center animate-carbon-reveal max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-xs bg-[#24A148]/15 border border-[#24A148]/40 flex items-center justify-center mx-auto text-[#24A148]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-mono uppercase tracking-wider text-[#42be65] bg-[#24A148]/15 border border-[#24A148]/40 px-2 py-0.5 rounded-xs font-medium">
                  91% SIMILARITY RECALLED
                </span>
                <h2 className="text-xl font-semibold text-[#F4F4F4]">
                  Historical Precedent: INC-104
                </h2>
                <p className="text-xs text-[#C6C6C6]">
                  OpsMind identifies that 6 weeks prior, a failure with identical telemetry occurred on the same service.
                </p>
              </div>

              <div className="p-4 rounded-xs bg-[#262626] border border-[#393939] text-left text-xs space-y-2 font-mono">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#393939]">
                  <span className="font-bold text-[#F4F4F4]">INC-104 • Payments API</span>
                  <span className="text-[#42be65] font-bold">91% Match</span>
                </div>
                <div className="text-[#C6C6C6]">
                  <span className="text-[#8D8D8D]">Root Cause:</span> DB connection leak in webhook error branch
                </div>
                <div className="text-[#42be65]">
                  <span className="text-[#8D8D8D]">Successful Fix:</span> Rollback v4.2.1
                </div>
                <div className="text-[#FA4D56]">
                  <span className="text-[#8D8D8D]">FAILED ATTEMPTS:</span> Restart API, Increase ECS replicas (worsened exhaustion from 96% to 100%)
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 5: Reflect Past vs Present */}
          {currentStep === 5 && (
            <div className="space-y-4 text-center animate-carbon-reveal max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-xs bg-[#0F62FE]/15 border border-[#0F62FE]/40 flex items-center justify-center mx-auto text-[#4589FF]">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-mono uppercase tracking-wider text-[#78A9FF] bg-[#0F62FE]/15 border border-[#0F62FE]/40 px-2 py-0.5 rounded-xs font-medium">
                  HINDSIGHT REFLECT • REASONING
                </span>
                <h2 className="text-xl font-semibold text-[#F4F4F4]">
                  OpsMind Reasons Over Discrepancies
                </h2>
                <p className="text-xs text-[#C6C6C6]">
                  The agent doesn't blindly replay the past — it contrasts release changes and previous ineffective actions.
                </p>
              </div>

              <div className="p-4 rounded-xs bg-[#1f2533] border border-[#4589FF]/30 text-left text-xs leading-relaxed space-y-2.5">
                <div className="text-[#EDF5FF]">
                  "This incident resembles INC-104, but the active deployment is v4.2.3 rather than v4.2.1. Inspect recent database connection-handling changes before performing a rollback."
                </div>
                <div className="p-2 rounded-xs bg-[#DA1E28]/15 border border-[#DA1E28]/40 text-[#FA4D56] font-mono text-[11px]">
                  ⚠️ WARNING: In INC-104, scaling replicas accelerated pool depletion. DO NOT scale pods or restart.
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 6: Contextual Recommendation */}
          {currentStep === 6 && (
            <div className="space-y-4 text-center animate-carbon-reveal max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-xs bg-[#0F62FE]/15 border border-[#0F62FE]/40 flex items-center justify-center mx-auto text-[#4589FF]">
                <Zap className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-mono uppercase tracking-wider text-[#78A9FF] bg-[#0F62FE]/15 border border-[#0F62FE]/40 px-2 py-0.5 rounded-xs font-medium">
                  EVIDENCE-FIRST RECOMMENDATION
                </span>
                <h2 className="text-xl font-semibold text-[#F4F4F4]">
                  Remediation Action Formulated
                </h2>
                <p className="text-xs text-[#C6C6C6]">
                  Human-in-the-loop: The agent presents an actionable resolution backed by empirical rationale.
                </p>
              </div>

              <div className="p-4 rounded-xs bg-[#262626] border border-[#393939] text-left space-y-2">
                <div className="text-xs font-semibold text-[#F4F4F4]">
                  Action: Rollback deployment to v4.2.2 or apply hotfix for unreleased pool clients
                </div>
                <div className="text-xs text-[#8D8D8D] space-y-1 font-mono">
                  <div>• Evidence: 94% DB pool saturation</div>
                  <div>• Timing: 12 minutes elapsed since v4.2.3 deployment</div>
                  <div>• Confidence: High (grounded in INC-104 memory)</div>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 7: Engineer Approves */}
          {currentStep === 7 && (
            <div className="space-y-4 text-center animate-carbon-reveal max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-xs bg-[#0F62FE]/15 border border-[#0F62FE]/40 flex items-center justify-center mx-auto text-[#4589FF]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-mono uppercase tracking-wider text-[#78A9FF] bg-[#0F62FE]/15 border border-[#0F62FE]/40 px-2 py-0.5 rounded-xs font-medium">
                  HUMAN IN THE LOOP
                </span>
                <h2 className="text-xl font-semibold text-[#F4F4F4]">
                  SRE Authorizes Execution
                </h2>
                <p className="text-xs text-[#C6C6C6]">
                  Informed by historical memory, the on-call engineer rejects pod restarts and executes the rollback.
                </p>
              </div>

              <div className="p-3.5 rounded-xs bg-[#161616] border border-[#393939] font-mono text-xs text-[#42be65]">
                [ Approved: Rollback deployment to v4.2.2 via ArgoCD ]
              </div>
            </div>
          )}

          {/* SCREEN 8: Incident Resolved */}
          {currentStep === 8 && (
            <div className="space-y-4 text-center animate-carbon-reveal max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-xs bg-[#24A148]/15 border border-[#24A148]/40 flex items-center justify-center mx-auto text-[#24A148]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-mono uppercase tracking-wider text-[#42be65] bg-[#24A148]/15 border border-[#24A148]/40 px-2 py-0.5 rounded-xs font-medium">
                  TELEMETRY RESTORED
                </span>
                <h2 className="text-xl font-semibold text-[#F4F4F4]">
                  Incident Resolved in 8m 42s
                </h2>
                <p className="text-xs text-[#C6C6C6]">
                  Connections drop from 94% to 26%. Latency normalizes from 5.1s to 118ms.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto font-mono text-xs">
                <div className="p-3 rounded-xs bg-[#262626] border border-[#393939]">
                  <div className="text-[10px] text-[#8D8D8D]">LATENCY</div>
                  <div className="text-[#42be65] font-bold text-sm">118ms (Nominal)</div>
                </div>
                <div className="p-3 rounded-xs bg-[#262626] border border-[#393939]">
                  <div className="text-[10px] text-[#8D8D8D]">DB POOL</div>
                  <div className="text-[#42be65] font-bold text-sm">26% (Healthy)</div>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 9: New Memory Created */}
          {currentStep === 9 && (
            <div className="space-y-4 text-center animate-carbon-reveal max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-xs bg-[#0F62FE]/15 border border-[#0F62FE]/40 flex items-center justify-center mx-auto text-[#4589FF]">
                <Database className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-mono uppercase tracking-wider text-[#78A9FF] bg-[#0F62FE]/15 border border-[#0F62FE]/40 px-2 py-0.5 rounded-xs font-medium">
                  HINDSIGHT RETAIN
                </span>
                <h2 className="text-xl font-semibold text-[#F4F4F4]">
                  New Organizational Memory Retained
                </h2>
                <p className="text-xs text-[#C6C6C6]">
                  The validated resolution and root-cause signature are immediately synthesized into persistent memory.
                </p>
              </div>

              <div className="p-3.5 rounded-xs bg-[#161616] border border-[#393939] text-left text-xs font-mono text-[#C6C6C6] space-y-1">
                <div className="text-[#4589FF] font-semibold">✓ client.retain("{bankName}", ...)</div>
                <div>Memory ID: MEM-INC137</div>
                <div className="text-[11px] text-[#8D8D8D]">Lesson: Webhook handler connection leak pattern re-verified in v4.2.3.</div>
              </div>
            </div>
          )}

          {/* SCREEN 10: Next Incident Benefits */}
          {currentStep === 10 && (
            <div className="space-y-4 text-center animate-carbon-reveal max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-xs bg-[#0F62FE] text-white flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#78A9FF] bg-[#0F62FE]/15 border border-[#0F62FE]/40 px-2.5 py-0.5 rounded-xs font-medium">
                  THE OPSMIND ASSURANCE
                </span>
                <h2 className="text-2xl font-bold text-[#F4F4F4] leading-tight">
                  "Every incident teaches the organization something.<br />OpsMind ensures the organization never forgets."
                </h2>
                <p className="text-xs text-[#C6C6C6] leading-relaxed">
                  By grounding investigations in organizational memory, engineering teams reduce MTTR by up to 66% and eliminate repeat troubleshooting loops.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    onClose();
                    onJumpToIncident('INC-137');
                  }}
                  className="px-4 py-2 rounded-xs bg-[#0F62FE] hover:bg-[#0353E9] active:bg-[#0043CE] text-white font-medium text-xs transition-colors cursor-pointer"
                >
                  Inspect Incident INC-137
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-[#393939]">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-[#262626] hover:bg-[#333333] disabled:opacity-30 text-xs font-mono text-[#C6C6C6] hover:text-[#F4F4F4] border border-[#393939] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="text-xs font-mono text-[#8D8D8D]">
            Slide {currentStep} of {totalSteps}
          </div>

          {currentStep < totalSteps ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xs bg-[#0F62FE] hover:bg-[#0353E9] active:bg-[#0043CE] text-xs font-medium text-white transition-colors cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xs bg-[#24A148] hover:bg-[#198038] text-xs font-medium text-white transition-colors cursor-pointer"
            >
              <span>Close Walkthrough</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
