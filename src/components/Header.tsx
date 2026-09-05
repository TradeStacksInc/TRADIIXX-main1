import React from 'react';
import { UserRole } from '../types';
import { 
  Building2, 
  Search, 
  Truck, 
  SlidersHorizontal,
  Bot,
  PlusCircle,
  Globe,
  ShoppingBag,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCreateRequest: () => void;
  onOpenAiAssistant: () => void;
  cnyNgnRate: number;
}

export const Header: React.FC<HeaderProps> = ({
  role,
  setRole,
  activeTab,
  setActiveTab,
  onOpenCreateRequest,
  onOpenAiAssistant,
  cnyNgnRate
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Banner Notice */}
      <div className="bg-[#FF6600] text-white text-xs py-1.5 px-4 flex items-center justify-between font-medium">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              AI Sourcing
            </span>
            <span className="text-xs truncate">Smart China-to-Nigeria Import Engine • 1,000+ Verified Factories</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="font-mono font-bold bg-black/15 px-2 py-0.5 rounded">
              1 CNY = ₦{cnyNgnRate} NGN
            </span>
            <div className="hidden sm:flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              <span>Deliver to: <strong>🇳🇬 Nigeria</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('marketplace')}>
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 rounded-lg bg-[#FF6600] text-white flex items-center justify-center font-black text-base shadow-sm">
                T
              </div>
              <span className="font-black text-2xl tracking-tight text-slate-900 font-sans">
                Tradiixx<span className="text-[#FF6600]">.com</span>
              </span>
            </div>
          </div>

          {/* Core Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200">
            {/* Sourcing Market: Visible to ALL */}
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'marketplace' 
                  ? 'bg-[#FF6600] text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              Sourcing Market
            </button>

            {/* Orders & Logistics: Customer & Admin */}
            {(role === 'customer' || role === 'admin') && (
              <button
                onClick={() => setActiveTab('tracking')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'tracking' 
                    ? 'bg-[#FF6600] text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                Orders & Shipments
              </button>
            )}

            {/* Manufacturer Intel: Merchandizer & Admin */}
            {(role === 'merchandizer' || role === 'admin') && (
              <button
                onClick={() => setActiveTab('merchandizer')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'merchandizer' 
                    ? 'bg-[#FF6600] text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                Factory Hub
              </button>
            )}

            {/* Admin Command: System Admin */}
            {role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'admin' 
                    ? 'bg-[#FF6600] text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Admin Panel
              </button>
            )}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenCreateRequest}
              className="flex items-center gap-1.5 bg-[#FF6600] hover:bg-orange-600 text-white font-bold text-xs px-4 py-2 rounded-full transition-all shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Request</span>
            </button>

            <button
              onClick={onOpenAiAssistant}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-2 rounded-full border border-slate-200 text-xs transition-all cursor-pointer"
              title="AI Import & Customs Assistant"
            >
              <Bot className="w-4 h-4 text-[#FF6600]" />
              <span className="hidden lg:inline text-xs">AI Assistant</span>
            </button>

            {/* Account Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-full text-xs">
              <span className="text-slate-400 font-bold text-[10px]">ROLE:</span>
              <select
                value={role}
                onChange={(e) => {
                  const r = e.target.value as UserRole;
                  setRole(r);
                  if (r === 'merchandizer') setActiveTab('merchandizer');
                  else if (r === 'admin') setActiveTab('admin');
                  else setActiveTab('marketplace');
                }}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="customer">Trader / Importer</option>
                <option value="merchandizer">Merchandizer</option>
                <option value="admin">System Admin</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

