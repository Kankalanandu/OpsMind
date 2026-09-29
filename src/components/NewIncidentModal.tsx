import React, { useState } from 'react';
import { 
  X, 
  AlertOctagon, 
  Sparkles
} from 'lucide-react';
import { Incident, Severity } from '../types/index.ts';

interface NewIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateIncident: (data: Partial<Incident>) => Promise<any>;
  onLoadIncident1: () => void;
  onLoadIncident2: () => void;
}

export const NewIncidentModal: React.FC<NewIncidentModalProps> = ({
  isOpen,
  onClose,
  onCreateIncident,
  onLoadIncident1,
  onLoadIncident2
}) => {
  const [title, setTitle] = useState('Payment Gateway Webhook Timeout');
  const [service, setService] = useState('Payments API');
  const [severity, setSeverity] = useState<Severity>('SEV-1');
  const [deploymentVersion, setDeploymentVersion] = useState('v4.2.3');
  const [symptoms, setSymptoms] = useState('API latency 5.1s, 16% error rate, DB connection pool 94%');
  const [affectedUsers, setAffectedUsers] = useState(28);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreateIncident({
      title,
      service,
      severity,
      deploymentVersion,
      symptoms: symptoms.split(',').map(s => s.trim()),
      affectedUsersPercentage: affectedUsers
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-carbon-reveal select-none">
      <div className="bg-[#262626] border border-[#525252] rounded-xs max-w-xl w-full p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#393939]">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-[#DA1E28]" />
            <h2 className="text-sm font-bold text-[#F4F4F4] font-mono uppercase tracking-wider">
              Declare Production Incident
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-xs bg-[#161616] hover:bg-[#333333] text-[#C6C6C6] hover:text-[#F4F4F4] flex items-center justify-center border border-[#393939] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Demo Buttons */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-mono text-[#78A9FF] uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#4589FF]" />
            <span>Fast Incident Simulation Presets</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <button
              type="button"
              onClick={() => {
                onLoadIncident1();
                onClose();
              }}
              className="p-2.5 rounded-xs bg-[#161616] hover:bg-[#333333] border border-[#393939] text-left transition-colors cursor-pointer"
            >
              <div className="text-[#F4F4F4] font-semibold">1. Demo Incident 1</div>
              <div className="text-[11px] text-[#8D8D8D]">INC-104 (First Occurrence)</div>
            </button>

            <button
              type="button"
              onClick={() => {
                onLoadIncident2();
                onClose();
              }}
              className="p-2.5 rounded-xs bg-[#1e2638] hover:bg-[#253147] border border-[#4589FF]/40 text-left transition-colors cursor-pointer"
            >
              <div className="text-[#78A9FF] font-semibold">2. Demo Incident 2</div>
              <div className="text-[11px] text-[#C6C6C6]">INC-137 (Learned Recall)</div>
            </button>
          </div>
        </div>

        {/* Custom Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="text-[10px] font-mono uppercase text-[#8D8D8D]">Incident Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 px-3 py-1.5 rounded-xs bg-[#161616] border border-[#393939] focus:border-[#0F62FE] text-[#F4F4F4] font-mono outline-none transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="text-[10px] font-mono uppercase text-[#8D8D8D]">Service</label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full mt-1 px-2.5 py-1.5 rounded-xs bg-[#161616] border border-[#393939] focus:border-[#0F62FE] text-[#F4F4F4] font-mono outline-none transition-colors"
              >
                <option value="Payments API">Payments API</option>
                <option value="Auth Gateway">Auth Gateway</option>
                <option value="Notification Service">Notification Service</option>
                <option value="Orders API">Orders API</option>
                <option value="Database Cluster">Database Cluster</option>
                <option value="Redis Cache">Redis Cache</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-[#8D8D8D]">Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as Severity)}
                className="w-full mt-1 px-2.5 py-1.5 rounded-xs bg-[#161616] border border-[#393939] focus:border-[#0F62FE] text-[#F4F4F4] font-mono outline-none transition-colors"
              >
                <option value="SEV-1">SEV-1 (Critical)</option>
                <option value="SEV-2">SEV-2 (High)</option>
                <option value="SEV-3">SEV-3 (Medium)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-[#8D8D8D]">Deploy Version</label>
              <input
                type="text"
                value={deploymentVersion}
                onChange={(e) => setDeploymentVersion(e.target.value)}
                className="w-full mt-1 px-3 py-1.5 rounded-xs bg-[#161616] border border-[#393939] focus:border-[#0F62FE] text-[#F4F4F4] font-mono outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-[#8D8D8D]">Symptoms & Telemetry</label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={2}
              className="w-full mt-1 px-3 py-1.5 rounded-xs bg-[#161616] border border-[#393939] focus:border-[#0F62FE] text-[#F4F4F4] font-mono outline-none transition-colors"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#393939]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xs bg-[#161616] hover:bg-[#333333] text-[#C6C6C6] hover:text-[#F4F4F4] font-mono text-xs border border-[#393939] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xs bg-[#DA1E28] hover:bg-[#b81921] text-white font-medium font-mono text-xs transition-colors cursor-pointer"
            >
              Declare Incident
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
