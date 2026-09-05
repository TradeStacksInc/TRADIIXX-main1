import React, { useState } from 'react';
import { Bot, X, Send, User, Loader2 } from 'lucide-react';

interface AiSupportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiSupportDrawer: React.FC<AiSupportDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: "Hello! I'm your Tradiixx AI Import & Customs Assistant. Ask me anything about importing from China to Nigeria, customs clearing duties in Lagos/Port Harcourt, Form M & PAAR regulations, sea vs air freight rates, or finding manufacturers!"
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isLoading) return;

    const userText = inputPrompt.trim();
    setInputPrompt('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/analyze-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: userText })
      });
      const data = await res.json();

      let reply = `Regarding "${userText}": Import duties to Nigeria typically range between 5% and 20% depending on HS Code classification. Sea freight to Lagos (Apapa/Tincan) takes approx 30-35 days, while Air Cargo takes 7-10 days. Tradiixx handles all customs clearance and door delivery automatically within your single NGN quote.`;

      if (data.analysis && data.analysis.suggestedKeywords) {
        reply = `Our AI Sourcing Engine recommends searching Chinese suppliers under keywords: ${data.analysis.suggestedKeywords.join(', ')}. Category: ${data.analysis.category}. Estimated shipping mode recommendation: Sea Freight for heavy bulk or Air Express for fast delivery.`;
      }

      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: 'Customs duties for general imports to Nigeria average 14% landed value. Our team handles complete clearance at Lagos port.' 
      }]);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#131722] shadow-2xl border-l border-[#2A2E39] flex flex-col justify-between text-[#D1D4DC]">
      {/* Header */}
      <div className="p-3.5 bg-[#0A0B0D] text-white flex items-center justify-between border-b border-[#2A2E39] font-mono">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-800">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-white">TRADIIXX AI AGENT</h3>
            <p className="text-[10px] text-orange-400">CHINA-NIGERIA ADVISOR</p>
          </div>
        </div>

        <button onClick={onClose} className="p-1 rounded bg-[#131722] hover:bg-[#1E222D] text-[#868993] hover:text-white cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-2.5 bg-[#0A0B0D] font-sans">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex gap-2 text-xs ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'ai' && (
              <div className="w-6 h-6 rounded bg-[#131722] text-orange-400 border border-[#2A2E39] flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`p-2.5 rounded text-xs leading-relaxed max-w-[85%] ${
                m.sender === 'user'
                  ? 'bg-orange-600 text-white rounded-br-none font-medium'
                  : 'bg-[#131722] text-[#D1D4DC] border border-[#2A2E39] rounded-bl-none'
              }`}
            >
              {m.text}
            </div>

            {m.sender === 'user' && (
              <div className="w-6 h-6 rounded bg-orange-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2 text-xs items-center text-[#868993] font-mono p-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-400" />
            <span>AI Analyzing customs rules...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 bg-[#131722] border-t border-[#2A2E39] flex gap-2 font-mono">
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="Customs duties, sea freight rate, Form M..."
          className="flex-1 px-3 py-1.5 bg-[#0A0B0D] border border-[#2A2E39] rounded text-xs text-[#D1D4DC] placeholder-[#868993] focus:outline-none focus:border-orange-500"
        />
        <button
          type="submit"
          disabled={isLoading || !inputPrompt.trim()}
          className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded text-xs transition-all disabled:opacity-50 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
