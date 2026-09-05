import React, { useState } from 'react';
import { ShippingMode } from '../types';
import { 
  X, 
  Sparkles, 
  Loader2
} from 'lucide-react';

interface BuyRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (requestData: any) => Promise<void>;
  initialQuery?: string;
  initialUrl?: string;
}

export const BuyRequestModal: React.FC<BuyRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialQuery = '',
  initialUrl = ''
}) => {
  const [customerName, setCustomerName] = useState('Chidi Okafor');
  const [customerEmail, setCustomerEmail] = useState('chidi.okafor@trader.ng');
  const [title, setTitle] = useState(initialQuery ? initialQuery.slice(0, 60) : '');
  const [description, setDescription] = useState(initialQuery || '');
  const [category, setCategory] = useState('Security & Surveillance');
  const [quantity, setQuantity] = useState<number>(100);
  const [destinationCity, setDestinationCity] = useState('Lagos');
  const [shippingPreference, setShippingPreference] = useState<ShippingMode>('SEA_FREIGHT');
  const [targetBudgetNgn, setTargetBudgetNgn] = useState<number>(3500000);
  const [productUrl, setProductUrl] = useState(initialUrl || '');
  const [mediaUrl, setMediaUrl] = useState('https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&auto=format&fit=crop&q=80');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    try {
      await onSubmit({
        customerName,
        customerEmail,
        title: title || description.slice(0, 50) || 'China Sourcing Request',
        description,
        category,
        quantity: Number(quantity),
        destinationCity,
        shippingPreference,
        targetBudgetNgn: Number(targetBudgetNgn),
        productUrls: productUrl ? [productUrl] : [],
        media: mediaUrl ? [{ type: 'image', url: mediaUrl, name: 'product_reference.jpg' }] : []
      });
      setIsAnalyzing(false);
      onClose();
    } catch (err) {
      setIsAnalyzing(false);
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0B0D]/90 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#131722] rounded border border-[#2A2E39] max-w-2xl w-full p-5 sm:p-6 shadow-2xl relative my-8 text-[#D1D4DC]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded bg-[#0A0B0D] border border-[#2A2E39] hover:bg-[#1E222D] text-[#868993] hover:text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-5 border-b border-[#2A2E39] pb-3">
          <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight font-sans">
              Start China AI Buy Request
            </h2>
            <p className="text-xs text-[#868993] font-mono">
              MATCH FACTORIES • GENERATE NGN LANDED COST QUOTE
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          {/* Buyer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono font-bold text-[#868993] mb-1 uppercase">NAME / TRADER ENTITY</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#0A0B0D] border border-[#2A2E39] rounded text-xs font-mono text-[#D1D4DC] focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono font-bold text-[#868993] mb-1 uppercase">EMAIL ADDRESS</label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#0A0B0D] border border-[#2A2E39] rounded text-xs font-mono text-[#D1D4DC] focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Product Description */}
          <div>
            <label className="block text-[11px] font-mono font-bold text-[#868993] mb-1 uppercase">
              PRODUCT IMPORT SPECIFICATIONS
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (!title) setTitle(e.target.value.slice(0, 50));
              }}
              placeholder="Be specific! E.g. 200 units 4G Solar CCTV camera, 8W panel, PIR motion detector..."
              className="w-full p-2.5 bg-[#0A0B0D] border border-[#2A2E39] rounded text-xs text-[#D1D4DC] placeholder-[#868993] focus:outline-none focus:border-emerald-500 resize-none font-sans"
            />
          </div>

          {/* Category & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono font-bold text-[#868993] mb-1 uppercase">PRODUCT CATEGORY</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#0A0B0D] border border-[#2A2E39] rounded text-xs font-mono font-semibold text-[#D1D4DC] focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="Security & Surveillance" className="bg-[#131722]">Security & Surveillance</option>
                <option value="Fashion & Footwear" className="bg-[#131722]">Fashion & Footwear</option>
                <option value="Machinery & Equipment" className="bg-[#131722]">Machinery & Equipment</option>
                <option value="Renewable Energy" className="bg-[#131722]">Renewable Energy</option>
                <option value="Electronics" className="bg-[#131722]">Electronics & Smart Devices</option>
                <option value="Beauty & Health" className="bg-[#131722]">Beauty & Health Equipment</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold text-[#868993] mb-1 uppercase">QUANTITY NEEDED</label>
              <input
                type="number"
                min={1}
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-[#0A0B0D] border border-[#2A2E39] rounded text-xs font-mono text-[#D1D4DC] focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Delivery City & Shipping Preference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono font-bold text-[#868993] mb-1 uppercase">DESTINATION CITY (NIGERIA)</label>
              <select
                value={destinationCity}
                onChange={(e) => setDestinationCity(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#0A0B0D] border border-[#2A2E39] rounded text-xs font-mono font-semibold text-[#D1D4DC] focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="Lagos" className="bg-[#131722]">Lagos (Apapa / Ikeja Hub)</option>
                <option value="Abuja" className="bg-[#131722]">Abuja (FCT Delivery)</option>
                <option value="Kano" className="bg-[#131722]">Kano (Kano Commercial Hub)</option>
                <option value="Port Harcourt" className="bg-[#131722]">Port Harcourt (Rivers)</option>
                <option value="Onitsha" className="bg-[#131722]">Onitsha (Anambra Market)</option>
                <option value="Ibadan" className="bg-[#131722]">Ibadan (Oyo State)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold text-[#868993] mb-1 uppercase">SHIPPING MODE PREFERENCE</label>
              <select
                value={shippingPreference}
                onChange={(e) => setShippingPreference(e.target.value as ShippingMode)}
                className="w-full px-3 py-1.5 bg-[#0A0B0D] border border-[#2A2E39] rounded text-xs font-mono font-semibold text-[#D1D4DC] focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="SEA_FREIGHT" className="bg-[#131722]">Sea Freight (~30-35 days, Lowest Cost)</option>
                <option value="AIR_CARGO" className="bg-[#131722]">Air Cargo (~7-10 days, Balanced)</option>
                <option value="AIR_EXPRESS" className="bg-[#131722]">Air Express (~3-5 days, Fastest)</option>
              </select>
            </div>
          </div>

          {/* Supplier Link & Sample Image URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono font-bold text-[#868993] mb-1 uppercase">1688 / ALIBABA LINK (OPTIONAL)</label>
              <input
                type="url"
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                placeholder="https://1688.com/item/..."
                className="w-full px-3 py-1.5 bg-[#0A0B0D] border border-[#2A2E39] rounded text-xs font-mono text-[#D1D4DC] placeholder-[#868993] focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold text-[#868993] mb-1 uppercase">IMAGE SPEC URL (OPTIONAL)</label>
              <input
                type="url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-1.5 bg-[#0A0B0D] border border-[#2A2E39] rounded text-xs font-mono text-[#D1D4DC] placeholder-[#868993] focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-[#2A2E39] flex items-center justify-end gap-2 font-mono">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-bold text-[#868993] hover:text-[#D1D4DC] hover:bg-[#1E222D] rounded transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-1.5 rounded transition-all disabled:opacity-50 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                  <span>Sourcing Factories...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>START AI MATCHING</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
