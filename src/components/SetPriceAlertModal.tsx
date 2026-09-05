import React, { useState } from 'react';
import { BuyerRequest, PriceAlert } from '../types';
import { 
  Bell, 
  BellRing, 
  X, 
  Check, 
  Sparkles, 
  TrendingDown, 
  Mail, 
  Phone, 
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Zap
} from 'lucide-react';

interface SetPriceAlertModalProps {
  request: BuyerRequest;
  currentAlert?: PriceAlert;
  cnyNgnRate?: number;
  isOpen: boolean;
  onClose: () => void;
  onSaveAlert: (alert: PriceAlert) => void;
  onDeleteAlert?: (alertId: string) => void;
}

export const SetPriceAlertModal: React.FC<SetPriceAlertModalProps> = ({
  request,
  currentAlert,
  cnyNgnRate = 215,
  isOpen,
  onClose,
  onSaveAlert,
  onDeleteAlert
}) => {
  if (!isOpen) return null;

  // Calculate default target unit price (e.g. 10% below current price)
  const currentTotalNgn = request.estimatedBudgetNgn || (request.targetUnitPriceCny ? request.targetUnitPriceCny * cnyNgnRate * request.quantity : 150000);
  const currentUnitPriceNgn = Math.round(currentTotalNgn / (request.quantity || 1));

  const [targetPriceNgn, setTargetPriceNgn] = useState<number>(
    currentAlert ? currentAlert.targetPriceNgn : Math.round(currentUnitPriceNgn * 0.9)
  );
  const [notifyEmail, setNotifyEmail] = useState<string>(
    currentAlert?.notifyEmail || request.customerEmail || 'user@example.com'
  );
  const [notifyPhone, setNotifyPhone] = useState<string>(
    currentAlert?.notifyPhone || '+234 803 892 1042'
  );
  const [channel, setChannel] = useState<'EMAIL' | 'WHATSAPP' | 'BOTH'>(
    currentAlert?.channel || 'BOTH'
  );
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [simulatedTrigger, setSimulatedTrigger] = useState<boolean>(false);

  const handleApplyDiscount = (discountPercent: number) => {
    const discounted = Math.round(currentUnitPriceNgn * (1 - discountPercent / 100));
    setTargetPriceNgn(discounted);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newAlert: PriceAlert = {
      id: currentAlert?.id || `ALERT-${Date.now()}`,
      requestId: request.id,
      requestTitle: request.title,
      targetPriceNgn: Number(targetPriceNgn),
      currentPriceNgn: currentUnitPriceNgn,
      notifyEmail,
      notifyPhone,
      channel,
      isActive: true,
      createdAt: currentAlert?.createdAt || new Date().toISOString()
    };

    onSaveAlert(newAlert);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  const handleSimulateDrop = () => {
    setSimulatedTrigger(true);
    setTimeout(() => {
      setSimulatedTrigger(false);
    }, 4000);
  };

  const savingsAmount = currentUnitPriceNgn - targetPriceNgn;
  const savingsPercent = Math.round((savingsAmount / currentUnitPriceNgn) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl relative my-8 text-slate-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6600] shrink-0">
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-extrabold text-[#FF6600] uppercase tracking-wider">
              <span>TARGET PRICE MONITOR</span>
              <span className="bg-orange-50 px-2 py-0.5 rounded border border-orange-200">1688 LIVE SCAN</span>
            </div>
            <h2 className="text-base font-extrabold text-slate-900 leading-tight">
              {currentAlert ? 'Manage Price Alert' : 'Set Price Alert'}
            </h2>
          </div>
        </div>

        {/* Product Overview Card */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 mb-4 flex items-center gap-3">
          {request.media && request.media.length > 0 && request.media[0].url ? (
            <img
              src={request.media[0].url}
              alt={request.title}
              className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-slate-200 flex items-center justify-center text-slate-400 shrink-0">
              <Bell className="w-6 h-6" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-bold text-slate-900 truncate">{request.title}</h3>
            <div className="flex items-center gap-2 text-[11px] mt-0.5 text-slate-500">
              <span>Current Est: <strong className="text-slate-900">₦{currentUnitPriceNgn.toLocaleString()}</strong>/unit</span>
              <span>•</span>
              <span>MOQ: <strong className="text-slate-900">{request.quantity} pcs</strong></span>
            </div>
          </div>
        </div>

        {/* Simulated Notification Trigger Preview Banner */}
        {simulatedTrigger && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-900 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start gap-2">
              <Zap className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold text-emerald-800">🎉 Price Drop Notification Simulated!</p>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  "Shenzhen Tech Optics reduced unit FOB price to <strong>₦{(targetPriceNgn - 5000).toLocaleString()}</strong>! Alert sent to {notifyEmail}."
                </p>
              </div>
            </div>
          </div>
        )}

        {isSuccess ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Price Alert Activated!</h3>
            <p className="text-xs text-slate-500">
              We'll automatically alert you when a verified China factory offers this below ₦{targetPriceNgn.toLocaleString()}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            {/* Target Price Threshold Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-extrabold text-slate-700 uppercase">
                  Target Price Threshold (NGN / Unit)
                </label>
                {savingsAmount > 0 && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <TrendingDown className="w-3 h-3 inline mr-0.5" />
                    Save ₦{savingsAmount.toLocaleString()} ({savingsPercent}% Off)
                  </span>
                )}
              </div>

              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-extrabold text-xs">₦</span>
                <input
                  type="number"
                  required
                  min="1000"
                  max={currentUnitPriceNgn * 2}
                  value={targetPriceNgn}
                  onChange={(e) => setTargetPriceNgn(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-extrabold text-slate-900 focus:outline-none focus:border-[#FF6600]"
                />
              </div>

              {/* Quick Percentage Presets */}
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[10px] text-slate-400 font-medium">Quick presets:</span>
                {[5, 10, 15, 20].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handleApplyDiscount(pct)}
                    className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 hover:bg-orange-50 hover:text-[#FF6600] border border-slate-200 transition-all cursor-pointer"
                  >
                    -{pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Notification Channels */}
            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 uppercase mb-1.5">
                Notification Method
              </label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setChannel('EMAIL')}
                  className={`p-2 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    channel === 'EMAIL' 
                      ? 'bg-orange-50 border-[#FF6600] text-[#FF6600]' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Email Only</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChannel('WHATSAPP')}
                  className={`p-2 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    channel === 'WHATSAPP' 
                      ? 'bg-orange-50 border-[#FF6600] text-[#FF6600]' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChannel('BOTH')}
                  className={`p-2 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    channel === 'BOTH' 
                      ? 'bg-orange-50 border-[#FF6600] text-[#FF6600]' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Both (Fastest)</span>
                </button>
              </div>

              {/* Contact Fields */}
              <div className="space-y-2">
                {(channel === 'EMAIL' || channel === 'BOTH') && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5 uppercase">Notification Email</label>
                    <input
                      type="email"
                      required
                      value={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#FF6600]"
                    />
                  </div>
                )}

                {(channel === 'WHATSAPP' || channel === 'BOTH') && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5 uppercase">WhatsApp Phone Number</label>
                    <input
                      type="text"
                      required
                      value={notifyPhone}
                      onChange={(e) => setNotifyPhone(e.target.value)}
                      placeholder="+234 800 000 0000"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#FF6600]"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Test Trigger / Simulate Button */}
            <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
              <span className="flex items-center gap-1 text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Scans 1688 & Guangzhou Direct
              </span>
              <button
                type="button"
                onClick={handleSimulateDrop}
                className="text-[#FF6600] font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <Zap className="w-3 h-3" />
                <span>Test Alert Drop</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-2">
              {currentAlert && onDeleteAlert && (
                <button
                  type="button"
                  onClick={() => {
                    onDeleteAlert(currentAlert.id);
                    onClose();
                  }}
                  className="p-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                  title="Delete Price Alert"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <button
                type="submit"
                className="flex-1 bg-[#FF6600] hover:bg-orange-600 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <BellRing className="w-4 h-4" />
                <span>{currentAlert ? 'Update Price Alert' : 'Activate Price Alert'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
