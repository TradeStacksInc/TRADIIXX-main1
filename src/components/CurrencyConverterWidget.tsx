import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  Copy, 
  Check, 
  Minimize2, 
  Maximize2, 
  Coins,
  TrendingUp
} from 'lucide-react';

interface CurrencyConverterWidgetProps {
  cnyNgnRate: number;
}

export const CurrencyConverterWidget: React.FC<CurrencyConverterWidgetProps> = ({ cnyNgnRate }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [mode, setMode] = useState<'CNY_TO_NGN' | 'NGN_TO_CNY'>('CNY_TO_NGN');
  const [amount, setAmount] = useState<string>('1000');
  const [copied, setCopied] = useState(false);

  const numAmount = parseFloat(amount) || 0;

  const resultAmount = mode === 'CNY_TO_NGN' 
    ? numAmount * cnyNgnRate 
    : numAmount / (cnyNgnRate || 1);

  const handleSwap = () => {
    if (resultAmount > 0) {
      setAmount(Math.round(resultAmount).toString());
    }
    setMode(prev => prev === 'CNY_TO_NGN' ? 'NGN_TO_CNY' : 'CNY_TO_NGN');
  };

  const handleCopy = () => {
    const fromLabel = mode === 'CNY_TO_NGN' ? `¥${numAmount.toLocaleString()} CNY` : `₦${numAmount.toLocaleString()} NGN`;
    const toLabel = mode === 'CNY_TO_NGN' 
      ? `₦${Math.round(resultAmount).toLocaleString()} NGN` 
      : `¥${resultAmount.toFixed(2)} CNY`;
    const copyText = `${fromLabel} = ${toLabel} (Rate: 1 CNY = ₦${cnyNgnRate} NGN)`;
    
    navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cnyPresets = [100, 500, 1000, 5000, 10000];
  const ngnPresets = [50000, 200000, 500000, 1000000, 5000000];

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans">
      {!isExpanded ? (
        /* Minimized Floating Button */
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2.5 bg-white hover:bg-slate-50 border border-slate-200 shadow-xl text-slate-900 px-4 py-2.5 rounded-full transition-all cursor-pointer group"
          title="Open Quick CNY / NGN FX Converter"
        >
          <div className="w-6 h-6 rounded-full bg-orange-100 text-[#FF6600] flex items-center justify-center shrink-0">
            <Coins className="w-3.5 h-3.5" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5 text-[10px] text-[#FF6600] font-bold uppercase tracking-wider">
              <span>FX CONVERTER</span>
            </div>
            <div className="text-xs font-bold text-slate-800">
              1 CNY = <span className="text-[#FF6600]">₦{cnyNgnRate.toLocaleString()}</span> NGN
            </div>
          </div>
          <Maximize2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 ml-1 transition-colors" />
        </button>
      ) : (
        /* Expanded Floating Widget Card */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-80 p-4 text-slate-800 relative animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#FF6600] flex items-center justify-center font-bold">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Quick FX Calculator
                </h4>
                <div className="text-[10px] text-[#FF6600] font-bold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>1 CNY = ₦{cnyNgnRate.toLocaleString()} NGN</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-all cursor-pointer"
              title="Minimize Converter"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Direction Toggle & Inputs */}
          <div className="space-y-3">
            {/* Source Input */}
            <div>
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-1 uppercase">
                <span>{mode === 'CNY_TO_NGN' ? 'China Yuan (CNY ¥)' : 'Nigerian Naira (NGN ₦)'}</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-[#FF6600]">
                  {mode === 'CNY_TO_NGN' ? '¥' : '₦'}
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full pl-7 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF6600]"
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center -my-1">
              <button
                type="button"
                onClick={handleSwap}
                className="p-1.5 rounded-full bg-white border border-slate-200 hover:border-[#FF6600] text-[#FF6600] transition-all cursor-pointer shadow-sm"
                title="Swap Direction"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 rotate-90" />
              </button>
            </div>

            {/* Converted Output Display */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center relative group">
              <span className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">
                {mode === 'CNY_TO_NGN' ? 'Estimated Naira' : 'Estimated Yuan'}
              </span>
              <div className="text-xl font-black text-[#FF6600] tracking-tight">
                {mode === 'CNY_TO_NGN' ? (
                  <>₦{Math.round(resultAmount).toLocaleString()}</>
                ) : (
                  <>¥{resultAmount.toFixed(2)}</>
                )}
              </div>
            </div>

            {/* Quick Amount Presets */}
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">
                Quick Presets
              </span>
              <div className="flex flex-wrap gap-1">
                {(mode === 'CNY_TO_NGN' ? cnyPresets : ngnPresets).map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val.toString())}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-orange-50 hover:text-[#FF6600] border border-slate-200 text-[10px] text-slate-700 font-bold transition-all cursor-pointer"
                  >
                    {mode === 'CNY_TO_NGN' ? `¥${val.toLocaleString()}` : `₦${(val / 1000).toFixed(0)}k`}
                  </button>
                ))}
              </div>
            </div>

            {/* Copy Button Footer */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[9px] text-slate-400">Live Exchange Rate</span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-[10px] font-bold text-[#FF6600] hover:text-orange-700 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Result</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

