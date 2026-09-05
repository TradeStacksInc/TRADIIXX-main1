import React, { useState, useMemo } from 'react';
import { BuyerRequest, BatchOptimizationBundle, BatchOptimizationPlan } from '../types';
import { 
  Sparkles, 
  Layers, 
  X, 
  Check, 
  TrendingDown, 
  Package, 
  Ship, 
  Plane, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  FileText, 
  Zap, 
  DollarSign, 
  Share2, 
  BarChart2, 
  RefreshCw
} from 'lucide-react';

interface AiProcurementOptimizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  requests: BuyerRequest[];
  cnyNgnRate?: number;
  onApplyBatchPlan?: (bundleIds: string[]) => void;
}

export const AiProcurementOptimizationModal: React.FC<AiProcurementOptimizationModalProps> = ({
  isOpen,
  onClose,
  requests,
  cnyNgnRate = 215,
  onApplyBatchPlan = (_bundleIds: string[]) => {}
}) => {
  if (!isOpen) return null;

  // Selected requests for batch analysis (default all active requests)
  const [selectedRequestIds, setSelectedRequestIds] = useState<string[]>(
    requests.map(r => r.id)
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isApplied, setIsApplied] = useState<boolean>(false);
  const [selectedBundleFilter, setSelectedBundleFilter] = useState<'ALL' | 'SEA' | 'AIR'>('ALL');

  const toggleRequestSelection = (id: string) => {
    setSelectedRequestIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleRerunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 800);
  };

  // Perform automated algorithmic batching calculation on active selected requests
  const optimizationPlan: BatchOptimizationPlan = useMemo(() => {
    const activeRequests = requests.filter(r => selectedRequestIds.includes(r.id));
    
    // Categorize requests into hubs based on title or category
    const electronics = activeRequests.filter(r => 
      r.category.toLowerCase().includes('electronic') || 
      r.title.toLowerCase().includes('camera') || 
      r.title.toLowerCase().includes('led') ||
      r.title.toLowerCase().includes('solar')
    );
    const fashionHeavy = activeRequests.filter(r => !electronics.includes(r));

    const bundles: BatchOptimizationBundle[] = [];

    if (electronics.length > 0) {
      const titles = electronics.map(e => e.title);
      const reqIds = electronics.map(e => e.id);
      const totalQty = electronics.reduce((acc, curr) => acc + (curr.quantity || 1), 0);
      const totalCbm = parseFloat((totalQty * 0.025).toFixed(2));
      const totalWeight = Math.round(totalQty * 1.8);
      const indivCost = electronics.reduce((acc, curr) => {
        const est = curr.estimatedBudgetNgn || (curr.targetUnitPriceCny ? curr.targetUnitPriceCny * cnyNgnRate * curr.quantity : 180000);
        return acc + Math.round(est * 0.22); // 22% individual freight ratio
      }, 0);
      
      const consolidatedCost = Math.round(indivCost * 0.68); // 32% discount
      const savings = indivCost - consolidatedCost;
      const savingsPct = Math.round((savings / (indivCost || 1)) * 100);

      bundles.push({
        id: 'BUNDLE-SZ-01',
        bundleName: 'Shenzhen Tech Hub Sea Freight (LCL Shared Container)',
        hubLocation: 'Shenzhen Baoan Consolidation Hub',
        destinationCity: electronics[0]?.destinationCity || 'Lagos (Apapa Port)',
        requestIds: reqIds,
        requestTitles: titles,
        shippingMode: 'SEA_FREIGHT',
        totalQuantity: totalQty,
        totalWeightKgEst: totalWeight,
        totalCbmEst: totalCbm,
        individualFreightCostNgn: indivCost,
        consolidatedFreightCostNgn: consolidatedCost,
        savingsNgn: savings,
        savingsPercent: savingsPct,
        transitDaysEst: 28,
        recommendationReason: 'Combining electronic requests in Shenzhen reduces port handling fees and triggers 20FT LCL volume discount.'
      });
    }

    if (fashionHeavy.length > 0) {
      const titles = fashionHeavy.map(e => e.title);
      const reqIds = fashionHeavy.map(e => e.id);
      const totalQty = fashionHeavy.reduce((acc, curr) => acc + (curr.quantity || 1), 0);
      const totalCbm = parseFloat((totalQty * 0.018).toFixed(2));
      const totalWeight = Math.round(totalQty * 0.9);
      const indivCost = fashionHeavy.reduce((acc, curr) => {
        const est = curr.estimatedBudgetNgn || (curr.targetUnitPriceCny ? curr.targetUnitPriceCny * cnyNgnRate * curr.quantity : 120000);
        return acc + Math.round(est * 0.28); // 28% individual freight ratio
      }, 0);
      
      const consolidatedCost = Math.round(indivCost * 0.76); // 24% discount
      const savings = indivCost - consolidatedCost;
      const savingsPct = Math.round((savings / (indivCost || 1)) * 100);

      bundles.push({
        id: 'BUNDLE-GZ-02',
        bundleName: 'Guangzhou Air Cargo Shared Freight Batch',
        hubLocation: 'Guangzhou Baiyun Cargo Hub',
        destinationCity: fashionHeavy[0]?.destinationCity || 'Lagos (MMIA Cargo Terminal)',
        requestIds: reqIds,
        requestTitles: titles,
        shippingMode: 'AIR_CARGO',
        totalQuantity: totalQty,
        totalWeightKgEst: totalWeight,
        totalCbmEst: totalCbm,
        individualFreightCostNgn: indivCost,
        consolidatedFreightCostNgn: consolidatedCost,
        savingsNgn: savings,
        savingsPercent: savingsPct,
        transitDaysEst: 7,
        recommendationReason: 'Consolidating Guangzhou goods into single air master bill reduces per-kg air cargo tariffs significantly.'
      });
    }

    const totalIndiv = bundles.reduce((acc, b) => acc + b.individualFreightCostNgn, 0);
    const totalConsol = bundles.reduce((acc, b) => acc + b.consolidatedFreightCostNgn, 0);
    const totalSavings = totalIndiv - totalConsol;
    const totalSavingsPct = Math.round((totalSavings / (totalIndiv || 1)) * 100);

    return {
      id: `PLAN-${Date.now()}`,
      totalRequestsAnalyzed: activeRequests.length,
      totalCurrentFreightNgn: totalIndiv,
      totalOptimizedFreightNgn: totalConsol,
      totalNetSavingsNgn: totalSavings,
      totalSavingsPercent: totalSavingsPct,
      bundles,
      generatedAt: new Date().toISOString()
    };
  }, [requests, selectedRequestIds, cnyNgnRate]);

  const filteredBundles = optimizationPlan.bundles.filter(b => {
    if (selectedBundleFilter === 'SEA') return b.shippingMode === 'SEA_FREIGHT';
    if (selectedBundleFilter === 'AIR') return b.shippingMode === 'AIR_CARGO' || b.shippingMode === 'AIR_EXPRESS';
    return true;
  });

  const handleApply = () => {
    onApplyBatchPlan(optimizationPlan.bundles.map(b => b.id));
    setIsApplied(true);
    setTimeout(() => {
      setIsApplied(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 max-w-3xl w-full border border-slate-200 shadow-2xl relative my-8 text-slate-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6600] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-[10px] font-extrabold text-[#FF6600] uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5" />
                <span>FREIGHT BATCHING ENGINE</span>
                <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">AI OPTIMIZED</span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                AI Procurement Freight Optimization
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRerunAnalysis}
              disabled={isAnalyzing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>Recalculate Batching</span>
            </button>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-extrabold text-slate-400 block uppercase">ANALYZED REQUESTS</span>
            <span className="text-xl font-black text-slate-900">{optimizationPlan.totalRequestsAnalyzed}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Active Buyer Items</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-extrabold text-slate-400 block uppercase">UNOPTIMIZED FREIGHT</span>
            <span className="text-xl font-black text-slate-500 line-through">₦{optimizationPlan.totalCurrentFreightNgn.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Separate Shipments</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-extrabold text-slate-400 block uppercase">CONSOLIDATED FREIGHT</span>
            <span className="text-xl font-black text-[#FF6600]">₦{optimizationPlan.totalOptimizedFreightNgn.toLocaleString()}</span>
            <span className="text-[10px] text-[#FF6600] font-bold block mt-0.5">Shared Container Batch</span>
          </div>

          <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200">
            <span className="text-[10px] font-extrabold text-emerald-800 block uppercase">ESTIMATED NET SAVINGS</span>
            <span className="text-xl font-black text-emerald-700">₦{optimizationPlan.totalNetSavingsNgn.toLocaleString()}</span>
            <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
              <TrendingDown className="w-3 h-3 inline mr-0.5" />
              {optimizationPlan.totalSavingsPercent}% Freight Reduction
            </span>
          </div>
        </div>

        {/* Active Requests Selection Checklist */}
        <div className="mb-5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-slate-800 uppercase flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-[#FF6600]" />
              Select Active Requests to Include in Consolidation Analysis ({selectedRequestIds.length}/{requests.length})
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
            {requests.map((req) => {
              const isChecked = selectedRequestIds.includes(req.id);
              return (
                <label
                  key={req.id}
                  onClick={() => toggleRequestSelection(req.id)}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                    isChecked 
                      ? 'bg-white border-[#FF6600] text-slate-900 shadow-2xs' 
                      : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200/60'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}} // handled by label click
                    className="accent-[#FF6600] rounded"
                  />
                  <div className="min-w-0 flex-1 truncate">
                    <p className="font-bold truncate">{req.title}</p>
                    <p className="text-[10px] text-slate-400">
                      {req.quantity} pcs • {req.destinationCity} • {req.category}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Bundle Filter Tabs */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#FF6600]" />
            Recommended Batch Consolidation Bundles ({filteredBundles.length})
          </h3>

          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px]">
            <button
              onClick={() => setSelectedBundleFilter('ALL')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                selectedBundleFilter === 'ALL' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedBundleFilter('SEA')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                selectedBundleFilter === 'SEA' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Sea LCL
            </button>
            <button
              onClick={() => setSelectedBundleFilter('AIR')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                selectedBundleFilter === 'AIR' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Air Cargo
            </button>
          </div>
        </div>

        {/* Bundles List */}
        {isAnalyzing ? (
          <div className="py-12 text-center space-y-3 bg-slate-50 rounded-xl border border-slate-200 mb-5">
            <RefreshCw className="w-8 h-8 text-[#FF6600] animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-700">AI re-analyzing volumetric weight, CBM & China hub routes...</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1 mb-5">
            {filteredBundles.map((bundle) => (
              <div 
                key={bundle.id}
                className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs hover:border-orange-300 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded bg-orange-50 text-[#FF6600]">
                        {bundle.shippingMode === 'SEA_FREIGHT' ? (
                          <Ship className="w-4 h-4" />
                        ) : (
                          <Plane className="w-4 h-4" />
                        )}
                      </span>
                      <h4 className="text-xs font-black text-slate-900">{bundle.bundleName}</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      <span>{bundle.hubLocation}</span>
                      <span>→</span>
                      <strong className="text-slate-800">{bundle.destinationCity}</strong>
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" />
                      Save ₦{bundle.savingsNgn.toLocaleString()} ({bundle.savingsPercent}%)
                    </span>
                  </div>
                </div>

                {/* Included Requests */}
                <div className="space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                  <span className="text-[10px] font-extrabold text-slate-400 block uppercase">INCLUDED ITEMS ({bundle.requestTitles.length})</span>
                  {bundle.requestTitles.map((title, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-slate-800 font-bold text-[11px]">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{title}</span>
                    </div>
                  ))}
                </div>

                {/* Cost Breakdown & AI Rationale */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <span className="text-[9px] font-bold text-slate-400 block">TOTAL VOLUME</span>
                    <span className="font-extrabold text-slate-800">{bundle.totalCbmEst} CBM</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <span className="text-[9px] font-bold text-slate-400 block">EST WEIGHT</span>
                    <span className="font-extrabold text-slate-800">{bundle.totalWeightKgEst} KG</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <span className="text-[9px] font-bold text-slate-400 block">EST TRANSIT</span>
                    <span className="font-extrabold text-slate-800">{bundle.transitDaysEst} Days</span>
                  </div>
                  <div className="bg-orange-50 p-2 rounded-lg border border-orange-200">
                    <span className="text-[9px] font-bold text-[#FF6600] block">BATCH FREIGHT</span>
                    <span className="font-black text-[#FF6600]">₦{bundle.consolidatedFreightCostNgn.toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 italic bg-amber-50/60 border border-amber-200/60 p-2 rounded-lg">
                  💡 <strong>AI Rationale:</strong> {bundle.recommendationReason}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6600]" />
            Batching locks shared container rates at Shenzhen & Guangzhou depots.
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer w-1/2 sm:w-auto text-center"
            >
              Close
            </button>

            <button
              onClick={handleApply}
              disabled={isApplied}
              className="px-5 py-2.5 rounded-xl bg-[#FF6600] hover:bg-orange-600 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm w-1/2 sm:w-auto"
            >
              {isApplied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Optimization Applied!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Apply Batch Shipping Plan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
