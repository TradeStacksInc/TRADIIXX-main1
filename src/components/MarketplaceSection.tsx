import React, { useState } from 'react';
import { BuyerRequest, RequestStatus, PriceAlert } from '../types';
import { CurrencyConverterWidget } from './CurrencyConverterWidget';
import { SetPriceAlertModal } from './SetPriceAlertModal';
import { AiProcurementOptimizationModal } from './AiProcurementOptimizationModal';
import { 
  Package, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  Search, 
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  SlidersHorizontal,
  ChevronDown,
  Bell,
  BellRing,
  Zap,
  Layers
} from 'lucide-react';

interface MarketplaceSectionProps {
  requests: BuyerRequest[];
  cnyNgnRate?: number;
  priceAlerts?: PriceAlert[];
  onSavePriceAlert?: (alert: PriceAlert) => void;
  onDeletePriceAlert?: (alertId: string) => void;
  onSelectRequest: (request: BuyerRequest) => void;
  onOpenCreateRequest: () => void;
}

export const MarketplaceSection: React.FC<MarketplaceSectionProps> = ({
  requests,
  cnyNgnRate = 215,
  priceAlerts = [],
  onSavePriceAlert = () => {},
  onDeletePriceAlert = () => {},
  onSelectRequest,
  onOpenCreateRequest
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Price alert modal state
  const [selectedAlertRequest, setSelectedAlertRequest] = useState<BuyerRequest | null>(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);

  // AI Procurement Freight Optimization state
  const [isProcurementOptimizationOpen, setIsProcurementOptimizationOpen] = useState<boolean>(false);

  const handleOpenAlertModal = (request: BuyerRequest, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedAlertRequest(request);
    setIsAlertModalOpen(true);
  };

  const categories = [
    { name: 'All Categories', count: requests.length },
    { name: 'Security & Surveillance', count: requests.filter(r => r.category.includes('Security')).length },
    { name: 'Fashion & Footwear', count: requests.filter(r => r.category.includes('Fashion')).length },
    { name: 'Machinery & Equipment', count: requests.filter(r => r.category.includes('Machinery')).length },
    { name: 'Renewable Energy', count: requests.filter(r => r.category.includes('Energy')).length },
    { name: 'Electronics', count: requests.filter(r => r.category.includes('Electronics')).length }
  ];

  const filteredRequests = requests.filter(req => {
    const matchesCategory = selectedCategory === 'All' || selectedCategory === 'All Categories' || req.category.includes(selectedCategory.split(' ')[0]);
    const matchesSearch = !searchQuery || 
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'QUOTE_READY':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Verified Quote
          </span>
        );
      case 'AI_SOURCING':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6600] animate-pulse"></span>
            Matching
          </span>
        );
      case 'ORDER_PLACED':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            In Production
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            Pending
          </span>
        );
    }
  };

  return (
    <section className="py-6 bg-[#F4F5F7] min-h-screen text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Control Filter Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Sourcing Feed</span>
              <span className="text-xs bg-orange-100 text-[#FF6600] px-2 py-0.5 rounded-full font-bold">
                {filteredRequests.length} Requests
              </span>
            </h2>

            {/* Active Price Alerts Counter Badge */}
            {priceAlerts.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  const targetReq = requests.find(r => priceAlerts.some(a => a.requestId === r.id));
                  if (targetReq) {
                    setSelectedAlertRequest(targetReq);
                    setIsAlertModalOpen(true);
                  }
                }}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-[#FF6600] border border-slate-200 text-xs font-bold transition-all cursor-pointer"
                title="Manage Active Price Alerts"
              >
                <BellRing className="w-3.5 h-3.5 text-[#FF6600]" />
                <span>Price Alerts ({priceAlerts.length})</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search requests or products..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF6600]"
              />
            </div>

            {/* AI Procurement Optimization Button */}
            <button
              onClick={() => setIsProcurementOptimizationOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-3.5 py-2 rounded-lg transition-all shadow-sm shrink-0 cursor-pointer flex items-center gap-1.5 border border-slate-700"
              title="Batch freight consolidation & cost optimization AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF6600]" />
              <span>AI Procurement Optimization</span>
            </button>

            <button
              onClick={onOpenCreateRequest}
              className="bg-[#FF6600] hover:bg-orange-600 text-white font-bold text-xs px-3.5 py-2 rounded-lg transition-all shadow-sm shrink-0 cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>+ New RFQ</span>
            </button>
          </div>
        </div>

        {/* Main Grid with Left Sidebar matching Alibaba layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Left Sidebar Category Filter */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                <span>Categories</span>
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </h3>

              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                      selectedCategory === cat.name
                        ? 'bg-orange-50 text-[#FF6600] font-bold border-l-4 border-[#FF6600]'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({cat.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Sourcing Notice Banner */}
            <div className="bg-gradient-to-br from-orange-500 to-amber-600 text-white p-4 rounded-xl shadow-sm text-xs font-sans space-y-2">
              <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-wider text-orange-100">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Inspection</span>
              </div>
              <p className="font-semibold leading-snug">
                Guangzhou QC check included before air or sea dispatch to Lagos.
              </p>
              <button
                onClick={onOpenCreateRequest}
                className="w-full bg-white text-[#FF6600] font-black py-1.5 px-3 rounded-lg text-[11px] shadow hover:bg-slate-50 transition-all cursor-pointer mt-1"
              >
                Post Custom Requirement
              </button>
            </div>
          </div>

          {/* Right Product & Buyer Request Cards Grid (Alibaba Style Cards) */}
          <div className="lg:col-span-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredRequests.map((req) => {
                // Calculate estimated price display
                const estimatedPriceNgn = req.estimatedBudgetNgn || (req.targetUnitPriceCny ? req.targetUnitPriceCny * cnyNgnRate * req.quantity : 150000);
                const unitPriceNgn = Math.round(estimatedPriceNgn / (req.quantity || 1));
                const activeAlert = priceAlerts.find(a => a.requestId === req.id && a.isActive);

                return (
                  <div
                    key={req.id}
                    onClick={() => onSelectRequest(req)}
                    className="bg-white rounded-xl border border-slate-200 hover:border-[#FF6600] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between overflow-hidden group"
                  >
                    <div>
                      {/* Product Thumbnail Container */}
                      <div className="aspect-square bg-slate-100 relative overflow-hidden">
                        {req.media && req.media.length > 0 && req.media[0].url ? (
                          <img
                            src={req.media[0].url}
                            alt={req.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <Package className="w-12 h-12" />
                          </div>
                        )}

                        {/* Top Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                          <span className="bg-[#FF6600] text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wider">
                            Super
                          </span>
                        </div>

                        <div className="absolute top-2 right-2">
                          {getStatusBadge(req.status)}
                        </div>

                        {/* Destination Pill */}
                        <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white text-[9px] px-2 py-0.5 rounded font-medium flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5 text-orange-400" />
                          <span>{req.destinationCity}, NG</span>
                        </div>
                      </div>

                      {/* Content Box */}
                      <div className="p-3">
                        {/* Title (2 lines max) */}
                        <h3 className="font-bold text-slate-800 text-xs line-clamp-2 leading-snug group-hover:text-[#FF6600] transition-colors mb-1.5">
                          {req.title}
                        </h3>

                        {/* Price in NGN */}
                        <div className="mb-1">
                          <span className="text-sm font-black text-slate-900 font-sans tracking-tight">
                            ₦{unitPriceNgn.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal ml-1">/ unit</span>
                        </div>

                        {/* MOQ & Stats */}
                        <div className="text-[10px] text-slate-500 font-medium flex items-center justify-between border-t border-slate-100 pt-1.5 mt-1.5">
                          <span>MOQ: <strong>{req.quantity} pcs</strong></span>
                          <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3" />
                            Verified
                          </span>
                        </div>

                        {/* Set Price Alert Action Button */}
                        <button
                          type="button"
                          onClick={(e) => handleOpenAlertModal(req, e)}
                          className={`w-full mt-2.5 py-1.5 px-2 rounded-lg text-[10px] font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            activeAlert
                              ? 'bg-orange-100 text-[#FF6600] border border-orange-300 shadow-2xs'
                              : 'bg-slate-50 text-slate-700 hover:bg-orange-50 hover:text-[#FF6600] hover:border-orange-200 border border-slate-200'
                          }`}
                        >
                          <BellRing className={`w-3.5 h-3.5 ${activeAlert ? 'text-[#FF6600] fill-[#FF6600]/20' : 'text-slate-400'}`} />
                          <span className="truncate">
                            {activeAlert ? `Alert: < ₦${activeAlert.targetPriceNgn.toLocaleString()}` : 'Set Price Alert'}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Bottom CTA bar */}
                    <div className="bg-slate-50 px-3 py-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-600">
                      <span className="text-slate-400 font-normal truncate">{req.category}</span>
                      <span className="text-[#FF6600] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                        <span>View RFQ</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredRequests.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
                <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-800">No matching requests found</h3>
                <p className="text-xs text-slate-500 mt-1">Try selecting another category or post a new request.</p>
                <button
                  onClick={onOpenCreateRequest}
                  className="mt-4 px-4 py-2 bg-[#FF6600] hover:bg-orange-600 text-white font-bold text-xs rounded-lg shadow-sm cursor-pointer"
                >
                  + Post New Buy Request
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Quick Currency Converter Widget */}
      <CurrencyConverterWidget cnyNgnRate={cnyNgnRate} />

      {/* Set Price Alert Modal */}
      {selectedAlertRequest && (
        <SetPriceAlertModal
          isOpen={isAlertModalOpen}
          onClose={() => setIsAlertModalOpen(false)}
          request={selectedAlertRequest}
          cnyNgnRate={cnyNgnRate}
          currentAlert={priceAlerts.find(a => a.requestId === selectedAlertRequest.id && a.isActive)}
          onSaveAlert={onSavePriceAlert}
          onDeleteAlert={onDeletePriceAlert}
        />
      )}

      {/* AI Procurement Freight Optimization Modal */}
      <AiProcurementOptimizationModal
        isOpen={isProcurementOptimizationOpen}
        onClose={() => setIsProcurementOptimizationOpen(false)}
        requests={requests}
        cnyNgnRate={cnyNgnRate}
      />
    </section>
  );
};

