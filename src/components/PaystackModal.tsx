import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Building, 
  Smartphone, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Loader2,
  ArrowRight
} from 'lucide-react';

interface PaystackModalProps {
  isOpen: boolean;
  onClose: () => void;
  amountNgn: number;
  productName: string;
  orderId?: string;
  customerEmail: string;
  onPaymentSuccess: (reference: string) => void;
}

export const PaystackModal: React.FC<PaystackModalProps> = ({
  isOpen,
  onClose,
  amountNgn,
  productName,
  orderId = 'ORD-2026-9042',
  customerEmail,
  onPaymentSuccess
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'ussd'>('card');
  const [cardNumber, setCardNumber] = useState('5399 4100 8821 9012');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('312');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [payReference, setPayReference] = useState('');

  if (!isOpen) return null;

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const ref = `PS-SINO-${Date.now()}-${Math.floor(1000 + Math.random() * 8999)}`;
    setPayReference(ref);

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentDone(true);
      onPaymentSuccess(ref);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0B0D]/90 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#131722] rounded border border-[#2A2E39] max-w-md w-full p-5 sm:p-6 shadow-2xl relative my-8 text-[#D1D4DC]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded bg-[#0A0B0D] border border-[#2A2E39] hover:bg-[#1E222D] text-[#868993] hover:text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {!paymentDone ? (
          <div>
            {/* Paystack Branded Header */}
            <div className="flex items-center justify-between border-b border-[#2A2E39] pb-3 mb-4 font-mono">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-xs">
                  P
                </div>
                <div>
                  <h3 className="font-bold text-white text-xs">PAYSTACK CHECKOUT</h3>
                  <p className="text-[10px] text-[#868993]">{customerEmail}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[9px] uppercase font-bold text-[#868993] block">TOTAL NGN</span>
                <span className="text-base font-bold text-emerald-400">₦{amountNgn.toLocaleString()}</span>
              </div>
            </div>

            {/* Product Summary Badge */}
            <div className="bg-[#0A0B0D] p-2.5 rounded border border-[#2A2E39] text-xs font-mono text-[#D1D4DC] mb-4">
              <span className="font-bold block text-white font-sans">{productName}</span>
              <span className="text-[10px] text-[#868993]">ORDER: {orderId} • GUARANTEED NGN COST</span>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="flex gap-1.5 mb-4 font-mono">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 py-1.5 px-2 rounded text-xs font-bold border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'bg-[#2563EB] text-white border-[#2563EB]'
                    : 'bg-[#0A0B0D] text-[#868993] border-[#2A2E39] hover:bg-[#1E222D]'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('bank')}
                className={`flex-1 py-1.5 px-2 rounded text-xs font-bold border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  paymentMethod === 'bank'
                    ? 'bg-[#2563EB] text-white border-[#2563EB]'
                    : 'bg-[#0A0B0D] text-[#868993] border-[#2A2E39] hover:bg-[#1E222D]'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>Transfer</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('ussd')}
                className={`flex-1 py-1.5 px-2 rounded text-xs font-bold border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  paymentMethod === 'ussd'
                    ? 'bg-[#2563EB] text-white border-[#2563EB]'
                    : 'bg-[#0A0B0D] text-[#868993] border-[#2A2E39] hover:bg-[#1E222D]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>USSD</span>
              </button>
            </div>

            <form onSubmit={handlePaySubmit} className="space-y-3 font-mono">
              {paymentMethod === 'card' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-[#868993] mb-1 uppercase">CARD NUMBER</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                      className="w-full px-3 py-1.5 bg-[#0A0B0D] border border-[#2A2E39] rounded text-xs font-mono text-[#D1D4DC] focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-[#868993] mb-1 uppercase">EXPIRY</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        required
                        className="w-full px-3 py-1.5 bg-[#0A0B0D] border border-[#2A2E39] rounded text-xs font-mono text-[#D1D4DC] focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#868993] mb-1 uppercase">CVV</label>
                      <input
                        type="password"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        required
                        maxLength={4}
                        className="w-full px-3 py-1.5 bg-[#0A0B0D] border border-[#2A2E39] rounded text-xs font-mono text-[#D1D4DC] focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {paymentMethod === 'bank' && (
                <div className="p-3 bg-[#0A0B0D] rounded border border-orange-800/80 text-xs text-orange-300 space-y-1.5 font-mono">
                  <span className="font-bold block text-orange-400">PAYSTACK DEDICATED ESCROW</span>
                  <p className="text-[11px]">Bank: <strong>Wema Bank / Paystack Titan</strong></p>
                  <p className="text-[11px]">Account: <strong className="text-orange-400 font-bold">9920184402</strong></p>
                  <p className="text-[11px]">Beneficiary: <strong>Tradiixx Escrow</strong></p>
                </div>
              )}

              {paymentMethod === 'ussd' && (
                <div className="p-3 bg-[#0A0B0D] rounded border border-[#2A2E39] text-xs text-[#D1D4DC] space-y-1 font-mono">
                  <span className="font-bold block text-white">USSD CODE</span>
                  <p className="text-[11px] text-[#868993]">Dial <strong className="text-orange-400">*737*33*4*9042#</strong> to authorize payment.</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black text-xs py-2.5 px-4 rounded transition-all flex items-center justify-center gap-1.5 mt-3 disabled:opacity-50 cursor-pointer font-mono"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>PAY ₦{amountNgn.toLocaleString()} NOW</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-3 text-center flex items-center justify-center gap-1 text-[10px] font-mono text-[#868993]">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>PAYSTACK 256-BIT SSL ENCRYPTED ESCROW</span>
            </div>
          </div>
        ) : (
          /* Payment Confirmation Success View */
          <div className="text-center py-4 space-y-3 font-mono">
            <div className="w-12 h-12 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">PAYMENT VERIFIED</span>
              <h3 className="text-lg font-black text-white mt-0.5">₦{amountNgn.toLocaleString()} Received</h3>
              <p className="text-[11px] text-[#868993] mt-0.5">Ref: <strong className="text-emerald-400">{payReference}</strong></p>
            </div>

            <div className="bg-[#0A0B0D] p-3 rounded border border-[#2A2E39] text-left text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-[#868993]">Order ID:</span>
                <span className="font-bold text-white">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#868993]">Product:</span>
                <span className="font-bold text-white line-clamp-1">{productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#868993]">Status:</span>
                <span className="font-bold text-emerald-400">PO ISSUED TO CHINA FACTORY</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-[#2563EB] hover:bg-blue-500 text-white font-bold text-xs py-2.5 rounded transition-all flex items-center justify-center gap-1.5 cursor-pointer font-mono"
            >
              <span>TRACK ORDER & VIEW TIMELINE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
