import React, { useState } from 'react';
import { AISourcingReport, BuyerRequest, Product, Manufacturer } from '../types';
import { ManufacturerBadges } from './ManufacturerBadges';
import { 
  X, 
  Sparkles, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  Info, 
  Package, 
  AlertTriangle
} from 'lucide-react';

interface AISourcingReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: AISourcingReport | null;
  request: BuyerRequest | null;
  onAcceptAndPay: (report: AISourcingReport, selectedProduct: Product, selectedManufacturer: Manufacturer) => void;
}

export const AISourcingReportModal: React.FC<AISourcingReportModalProps> = ({
  isOpen,
  onClose,
  report,
  request,
  onAcceptAndPay
}) => {
  const [selectedAltIndex, setSelectedAltIndex] = useState<number>(0);

  if (!isOpen || !report) return null;

  const currentMatch = selectedAltIndex === 0 
    ? report.bestMatch 
    : (report.alternatives[selectedAltIndex - 1]?.match || report.bestMatch);

  const landedCost = report.suggestedLandedCost;
  const product = currentMatch.product;
  const mfg = currentMatch.manufacturer;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0B0D]/90 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#131722] rounded border border-[#2A2E39] max-w-4xl w-full p-5 sm:p-6 shadow-2xl relative my-6 text-[#D1D4DC]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded bg-[#0A0B0D] border border-[#2A2E39] hover:bg-[#1E222D] text-[#868993] hover:text-white transition-all z-10 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-[#2A2E39] pb-4 mb-5">
          <div className="flex flex-wrap items-center gap-2 mb-2 font-mono">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-orange-950 text-orange-400 border border-orange-800">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              AI SOURCING REPORT
            </span>
            <span className="text-xs text-[#868993]">REQ: {report.buyerRequestId}</span>
            <span className="text-[#2A2E39]">•</span>
            <span className="text-xs text-orange-400 font-bold">{report.confidenceScore}% MATCH CONFIDENCE</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-sans">
            {product.productName}
          </h2>
          <p className="text-xs text-[#868993] mt-1 font-mono">
            SOURCED FROM VERIFIED CHINA FACTORIES • DESTINATION: <strong className="text-white">{request?.destinationCity || 'Lagos'}, NIGERIA</strong>
          </p>
        </div>

        {/* Alternative Product Options Bar */}
        {report.alternatives && report.alternatives.length > 0 && (
          <div className="mb-5 bg-[#0A0B0D] p-1.5 rounded border border-[#2A2E39] flex flex-wrap gap-2 font-mono">
            <button
              onClick={() => setSelectedAltIndex(0)}
              className={`flex-1 min-w-[140px] px-3 py-2 rounded text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                selectedAltIndex === 0
                  ? 'bg-[#2563EB] text-white shadow'
                  : 'bg-[#131722] text-[#868993] hover:text-[#D1D4DC] border border-[#2A2E39]'
              }`}
            >
              <span>Recommended Match (96%)</span>
              <span className="text-emerald-400">₦{landedCost.totalLandedCostNgn.toLocaleString()}</span>
            </button>

            {report.alternatives.map((alt, idx) => (
              <button
                key={alt.label}
                onClick={() => setSelectedAltIndex(idx + 1)}
                className={`flex-1 min-w-[140px] px-3 py-2 rounded text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  selectedAltIndex === idx + 1
                    ? 'bg-[#2563EB] text-white shadow'
                    : 'bg-[#131722] text-[#868993] hover:text-[#D1D4DC] border border-[#2A2E39]'
                }`}
              >
                <span>{alt.label}</span>
                <span className="text-emerald-400">₦{alt.landedCostNgn.toLocaleString()}</span>
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Product & Manufacturer Intelligence */}
          <div className="lg:col-span-7 space-y-4">
            {/* Product Card */}
            <div className="bg-[#0A0B0D] rounded p-4 border border-[#2A2E39]">
              <div className="flex gap-3">
                {product.productImages && product.productImages[0] ? (
                  <img
                    src={product.productImages[0]}
                    alt={product.productName}
                    className="w-20 h-20 rounded object-cover shrink-0 border border-[#2A2E39]"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-20 h-20 rounded bg-[#131722] border border-[#2A2E39] flex items-center justify-center shrink-0">
                    <Package className="w-6 h-6 text-[#868993]" />
                  </div>
                )}

                <div className="space-y-1 font-sans">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-[10px] font-bold uppercase bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-800">
                      MODEL: {product.modelNumber}
                    </span>
                    <span className="text-[10px] text-[#868993]">SKU: {product.sku}</span>
                  </div>
                  <h4 className="font-bold text-xs text-white leading-snug">{product.productName}</h4>
                  <p className="text-[10px] text-[#868993] italic font-mono">{product.productNameChinese}</p>
                  <p className="text-xs text-[#868993] line-clamp-2 mt-1">{product.description}</p>
                </div>
              </div>

              {/* Technical Specifications Grid */}
              <div className="mt-3 pt-3 border-t border-[#2A2E39]">
                <h5 className="text-[10px] font-mono uppercase font-bold text-[#868993] mb-2">TECHNICAL SPECIFICATIONS</h5>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {Object.entries(product.specifications || {}).map(([key, val]) => (
                    <div key={key} className="bg-[#131722] p-2 rounded border border-[#2A2E39]">
                      <span className="text-[9px] font-bold text-[#868993] block uppercase">{key}</span>
                      <span className="font-bold text-[#D1D4DC]">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Manufacturer Profile */}
            <div className="bg-[#0A0B0D] rounded p-4 border border-[#2A2E39] space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded bg-[#131722] border border-[#2A2E39] text-emerald-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
                      <span>{mfg.companyName}</span>
                    </h4>
                    <p className="text-[10px] text-[#868993] font-mono">{mfg.companyNameChinese} • {mfg.city}, {mfg.province}, China</p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 shrink-0">
                  SCORE: {mfg.internalScore}/100
                </span>
              </div>

              {/* Visual Badges for Verified Supplier, Years Experience, and ISO Certifications */}
              <div className="pt-1.5 pb-1.5 border-y border-[#2A2E39]/60">
                <ManufacturerBadges manufacturer={mfg} />
              </div>

              <div className="grid grid-cols-3 gap-2 text-center p-2 rounded bg-[#131722] border border-[#2A2E39] text-xs font-mono">
                <div>
                  <span className="text-[9px] font-bold text-[#868993] block">FACTORY SIZE</span>
                  <span className="font-bold text-white">{mfg.factorySize}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-[#868993] block">CAPACITY</span>
                  <span className="font-bold text-white">{mfg.productionCapacity}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-[#868993] block">LEAD TIME</span>
                  <span className="font-bold text-white">{product.productionLeadTimeDays} Days</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 font-mono">
                {mfg.capabilities.oem && <span className="text-[9px] font-bold bg-[#131722] border border-[#2A2E39] text-[#D1D4DC] px-2 py-0.5 rounded">OEM AVAILABLE</span>}
                {mfg.capabilities.odm && <span className="text-[9px] font-bold bg-[#131722] border border-[#2A2E39] text-[#D1D4DC] px-2 py-0.5 rounded">ODM CUSTOM</span>}
                {mfg.capabilities.privateLabel && <span className="text-[9px] font-bold bg-[#131722] border border-[#2A2E39] text-[#D1D4DC] px-2 py-0.5 rounded">PRIVATE BRAND</span>}
              </div>
            </div>

            {/* AI Explanation Box */}
            <div className="bg-emerald-950/40 border border-emerald-800/80 rounded p-3 text-xs text-emerald-300 font-sans">
              <div className="flex items-center gap-1.5 font-bold mb-1 text-emerald-200 font-mono">
                <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>AI SOURCING LOGIC & MATCH REASONING</span>
              </div>
              <p className="leading-relaxed text-[11px] text-emerald-200/90">{report.aiExplanation}</p>
            </div>
          </div>

          {/* Right Column: NGN Landed Cost Breakdown & Checkout */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4 font-mono">
            <div className="bg-[#0A0B0D] text-[#D1D4DC] rounded p-5 border border-[#2A2E39] relative">
              <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-[#2A2E39]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block">ESTIMATED LANDED COST</span>
                  <span className="text-[11px] text-[#868993]">All-Inclusive Quote to Nigeria</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                    1 CNY = ₦{landedCost.exchangeRateNgnCny}
                  </span>
                </div>
              </div>

              {/* Itemized Line Items */}
              <div className="space-y-2 text-xs mb-5">
                <div className="flex justify-between items-center text-[#868993]">
                  <span>Product Purchase ({request?.quantity || 100} {product.unit})</span>
                  <span className="font-bold text-white">₦{landedCost.productCostNgn.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center text-[#868993]">
                  <span>Procurement & Supplier Fee</span>
                  <span className="font-bold text-white">₦{landedCost.procurementFeeNgn.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center text-[#868993]">
                  <span>China Warehouse QC Inspection</span>
                  <span className="font-bold text-white">₦{landedCost.chinaWarehouseFeeNgn.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center text-[#868993]">
                  <span>Freight ({landedCost.shippingMode.replace('_', ' ')})</span>
                  <span className="font-bold text-white">₦{landedCost.internationalShippingNgn.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center text-[#868993]">
                  <span>Customs Duties & Clearance</span>
                  <span className="font-bold text-white">₦{landedCost.estimatedCustomsNgn.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center text-[#868993]">
                  <span>Nigeria Courier Delivery</span>
                  <span className="font-bold text-white">₦{landedCost.localDeliveryNgn.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center text-[#868993]">
                  <span>Platform Fee & Insurance</span>
                  <span className="font-bold text-white">₦{landedCost.platformServiceFeeNgn.toLocaleString()}</span>
                </div>
              </div>

              {/* Total Landed Cost Display */}
              <div className="pt-3 border-t border-[#2A2E39]">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xs uppercase font-bold text-[#868993]">TOTAL LANDED COST</span>
                  <span className="text-xl sm:text-2xl font-black text-orange-400">
                    ₦{landedCost.totalLandedCostNgn.toLocaleString()}
                  </span>
                </div>
                <p className="text-[10px] text-[#868993] text-right">
                  Approx. ₦{Math.round(landedCost.totalLandedCostNgn / (request?.quantity || 100)).toLocaleString()} per unit
                </p>
              </div>

              {/* Human Approval Warning if Threshold Exceeded */}
              {report.requiresHumanApproval && (
                <div className="mt-3 p-2.5 rounded bg-amber-950/80 border border-amber-800 text-[10px] text-amber-200 flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold block">MERCHANDIZER VERIFICATION REQUIRED</strong>
                    Order exceeds ₦1,500,000 threshold. Will be reviewed by Merchandizer prior to factory dispatch.
                  </div>
                </div>
              )}

              {/* Accept Quote CTA */}
              <button
                onClick={() => onAcceptAndPay(report, product, mfg)}
                className="w-full mt-5 bg-orange-600 hover:bg-orange-500 text-white font-black text-xs py-3 px-4 rounded shadow flex items-center justify-center gap-1.5 transition-all cursor-pointer font-mono"
              >
                <span>ACCEPT QUOTE & PAY VIA PAYSTACK</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="text-[10px] text-[#868993] bg-[#0A0B0D] p-3 rounded border border-[#2A2E39] space-y-1">
              <p className="font-bold text-[#D1D4DC]">✓ Guaranteed NGN Landed Cost</p>
              <p>Quotations valid for 48 hours. Payments processed securely via Paystack in Naira.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
