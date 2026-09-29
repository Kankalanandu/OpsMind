import React, { useState } from 'react';
import { 
  X, 
  BrainCircuit, 
  Send, 
  RotateCcw
} from 'lucide-react';
import { Incident, HindsightStatus } from '../types/index.ts';

interface AskOpsMindDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentIncident: Incident | null;
  initialQuestion?: string;
  hindsightStatus?: HindsightStatus | null;
}

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}

export const AskOpsMindDrawer: React.FC<AskOpsMindDrawerProps> = ({
  isOpen,
  onClose,
  currentIncident,
  initialQuestion,
  hindsightStatus
}) => {
  const bankName = hindsightStatus?.bankId || 'OpsMind';
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'agent',
      text: currentIncident 
        ? `Hello, I'm OpsMind. I have active context for incident ${currentIncident.id} (${currentIncident.service}) and connected access to organizational memory in bank ${bankName}. How can I assist?`
        : `Hello, I'm OpsMind, your self-learning production incident intelligence agent. Ask me about historical incidents, past resolutions, or current system telemetry.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const quickChips = [
    "What happened?",
    "Have we seen this before?",
    "What worked last time?",
    "Why are you recommending rollback?",
    "What did we learn from INC-104?",
    "What should I investigate next?"
  ];

  const handleSend = async (questionText: string) => {
    if (!questionText.trim() || loading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: questionText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentId: currentIncident?.id || null,
          question: questionText
        })
      });
      const data = await res.json();
      const agentMsg: Message = {
        id: `a-${Date.now()}`,
        sender: 'agent',
        text: data.answer || 'OpsMind processed the query against organizational memory.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, agentMsg]);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-[#161616] border-l border-[#393939] shadow-2xl flex flex-col justify-between animate-carbon-reveal select-none">
      {/* Top Header */}
      <div className="p-4 border-b border-[#393939] flex items-center justify-between bg-[#161616]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xs bg-[#0F62FE] flex items-center justify-center text-white shrink-0">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#F4F4F4] flex items-center gap-2 font-mono">
              <span className="text-sm">Ask OpsMind</span>
              <span className="text-[10px] text-[#78A9FF] bg-[#4589FF]/15 px-1.5 py-0.2 rounded-xs border border-[#4589FF]/40 font-mono font-bold">
                Hindsight Live
              </span>
            </div>
            <div className="text-[11px] text-[#8D8D8D] font-mono">
              Context: {currentIncident ? `${currentIncident.id} (${currentIncident.service})` : 'Global Production'}
            </div>
          </div>
        </div>

        <button 
          onClick={onClose} 
          className="w-7 h-7 rounded-xs bg-[#262626] hover:bg-[#333333] text-[#C6C6C6] hover:text-[#F4F4F4] flex items-center justify-center border border-[#393939] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs font-mono">
        {messages.map(m => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] p-3 rounded-xs leading-relaxed text-xs ${
                m.sender === 'user'
                  ? 'bg-[#262626] border border-[#525252] text-[#F4F4F4]'
                  : 'bg-[#1f2533] border border-[#4589FF]/30 text-[#EDF5FF] border-l-2 border-l-[#4589FF]'
              }`}
            >
              {m.text}
            </div>
            <span className="text-[10px] text-[#8D8D8D] mt-1 font-mono">{m.timestamp}</span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-[#78A9FF] text-xs font-mono p-3 bg-[#1f2533] rounded-xs border border-[#4589FF]/30">
            <RotateCcw className="w-3.5 h-3.5 animate-spin text-[#4589FF]" />
            <span>Consulting Hindsight memory bank...</span>
          </div>
        )}
      </div>

      {/* Quick Prompt Chips & Input */}
      <div className="p-3.5 border-t border-[#393939] space-y-2.5 bg-[#161616]">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono">
          {quickChips.map((chip, i) => (
            <button
              key={i}
              onClick={() => handleSend(chip)}
              className="px-2.5 py-1 rounded-xs bg-[#262626] hover:bg-[#333333] border border-[#393939] text-[#C6C6C6] hover:text-[#F4F4F4] whitespace-nowrap transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about historical incidents, fixes..."
            className="flex-1 px-3 py-2 rounded-xs bg-[#262626] border border-[#393939] focus:border-[#0F62FE] text-xs font-mono text-[#F4F4F4] placeholder-[#8D8D8D] outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2 rounded-xs bg-[#0F62FE] hover:bg-[#0353E9] active:bg-[#0043CE] disabled:opacity-40 text-white transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
