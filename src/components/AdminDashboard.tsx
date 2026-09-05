import React, { useState } from 'react';
import { AISettingConfig, Order, LedgerEntry } from '../types';
import { 
  SlidersHorizontal, 
  Save, 
  CheckCircle2
} from 'lucide-react';

interface AdminDashboardProps {
  settings: AISettingConfig;
  orders: Order[];
  ledger: LedgerEntry[];
  onSaveSettings: (newSettings: AISettingConfig) => Promise<void>;
  onUpdateOrderStatus: (orderId: string, status: string, title?: string, description?: string) => Promise<void>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  settings,
  orders,
  ledger,
  onSaveSettings,
  onUpdateOrderStatus
}) => {
  const [activeTab, setActiveTab] = useState<'ai-settings' | 'orders' | 'ledger'>('ai-settings');
  const [formSettings, setFormSettings] = useState<AISettingConfig>({ ...settings });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Total NGN Revenue
  const totalRevenueNgn = ledger
    .filter(l => l.type === 'PAYMENT_RECEIVED')
    .reduce((acc, l) => acc + l.amountNgn, 0);

  const totalProcurementExpensesNgn = ledger
    .filter(l => l.type === 'PROCUREMENT_PAID')
    .reduce((acc, l) => acc + l.amountNgn, 0);

  const netProfitNgn = Math.round(totalRevenueNgn * (formSettings.platformMarginPercent / 100));

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSaveSettings(formSettings);
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="py-8 bg-[#F4F5F7] text-slate-800 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#FF6600] uppercase tracking-wider mb-1">
              <SlidersHorizontal className="w-4 h-4" />
              <span>EXECUTIVE CONTROL MATRIX</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Admin Platform Control
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage FX CNY/NGN rates, AI sourcing formula weights & financial ledger
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('ai-settings')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'ai-settings' ? 'bg-[#FF6600] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              AI Formula & Rates
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'orders' ? 'bg-[#FF6600] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('ledger')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'ledger' ? 'bg-[#FF6600] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              NGN Ledger
            </button>
          </div>
        </div>

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">TOTAL GMV CLEARED</span>
            <span className="text-2xl font-extrabold text-slate-900">₦{totalRevenueNgn.toLocaleString()}</span>
            <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Paystack Escrow</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">CHINA DISBURSEMENTS</span>
            <span className="text-2xl font-extrabold text-slate-900">₦{totalProcurementExpensesNgn.toLocaleString()}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Factory PO Invoices</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">PLATFORM MARGIN PROFIT</span>
            <span className="text-2xl font-extrabold text-emerald-600">₦{netProfitNgn.toLocaleString()}</span>
            <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">{formSettings.platformMarginPercent}% Platform Margin</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">CNY/NGN FX RATE</span>
            <span className="text-2xl font-extrabold text-[#FF6600]">₦{formSettings.cnyNgnExchangeRate}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Per 1 CNY (RMB)</span>
          </div>
        </div>

        {/* Tab 1: AI Sourcing Settings & Rules */}
        {activeTab === 'ai-settings' && (
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm max-w-4xl mx-auto space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900">AI Sourcing Formula & Exchange Config</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Adjust matching weight matrices, platform margin %, and FX conversion values.
                </p>
              </div>

              {saveSuccess && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  CONFIG SAVED
                </span>
              )}
            </div>

            <form onSubmit={handleSettingsSubmit} className="space-y-4">
              {/* Financial Parameters */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h3 className="text-[10px] uppercase font-bold text-[#FF6600] tracking-wider">FINANCIAL & FX CONVERSION CONFIG</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">CNY TO NGN RATE</label>
                    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5">
                      <span className="text-xs font-bold text-slate-400">1 CNY = ₦</span>
                      <input
                        type="number"
                        value={formSettings.cnyNgnExchangeRate}
                        onChange={(e) => setFormSettings({ ...formSettings, cnyNgnExchangeRate: Number(e.target.value) })}
                        className="w-full text-xs font-bold text-slate-900 focus:outline-none bg-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">PLATFORM MARGIN (%)</label>
                    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5">
                      <input
                        type="number"
                        step="0.1"
                        value={formSettings.platformMarginPercent}
                        onChange={(e) => setFormSettings({ ...formSettings, platformMarginPercent: Number(e.target.value) })}
                        className="w-full text-xs font-bold text-slate-900 focus:outline-none bg-transparent"
                      />
                      <span className="text-xs font-bold text-slate-400">%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">AUTO APPROVAL LIMIT (NGN)</label>
                    <input
                      type="number"
                      value={formSettings.autoApprovalThresholdNgn}
                      onChange={(e) => setFormSettings({ ...formSettings, autoApprovalThresholdNgn: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* AI Scoring Weights */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h3 className="text-[10px] uppercase font-bold text-[#FF6600] tracking-wider">AI RECOMMENDATION WEIGHT DISTRIBUTION</h3>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Specification Match Weight</span>
                      <span className="text-[#FF6600]">{formSettings.weightSpecificationMatch}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={formSettings.weightSpecificationMatch}
                      onChange={(e) => setFormSettings({ ...formSettings, weightSpecificationMatch: Number(e.target.value) })}
                      className="w-full accent-[#FF6600] bg-slate-200"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Factory Reliability & Audit Score</span>
                      <span className="text-[#FF6600]">{formSettings.weightManufacturerReliability}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={formSettings.weightManufacturerReliability}
                      onChange={(e) => setFormSettings({ ...formSettings, weightManufacturerReliability: Number(e.target.value) })}
                      className="w-full accent-[#FF6600] bg-slate-200"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>FOB Price Competitiveness</span>
                      <span className="text-[#FF6600]">{formSettings.weightPriceSuitability}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={formSettings.weightPriceSuitability}
                      onChange={(e) => setFormSettings({ ...formSettings, weightPriceSuitability: Number(e.target.value) })}
                      className="w-full accent-[#FF6600] bg-slate-200"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-[#FF6600] hover:bg-orange-600 text-white font-bold text-xs py-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>SAVE ADMIN CONFIGURATION</span>
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Orders & Procurement Status Manager */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-xs font-extrabold text-slate-900 uppercase">Active Procurement Orders Control</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
                    <th className="p-3">Order Ref</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Product</th>
                    <th className="p-3">Amount NGN</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-bold text-[#FF6600]">{ord.id}</td>
                      <td className="p-3 text-slate-900">{ord.customerName}</td>
                      <td className="p-3 text-slate-900 font-bold">{ord.productName}</td>
                      <td className="p-3 font-black text-slate-900">₦{ord.totalAmountNgn.toLocaleString()}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {ord.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3">
                        <select
                          value={ord.status}
                          onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[10px] font-bold text-slate-800 focus:outline-none cursor-pointer"
                        >
                          <option value="PAID">PAID</option>
                          <option value="PROCUREMENT_STARTED">PROCUREMENT STARTED</option>
                          <option value="ARRIVED_CHINA_WAREHOUSE">ARRIVED CHINA WAREHOUSE</option>
                          <option value="QC_INSPECTION_PASSED">QC INSPECTION PASSED</option>
                          <option value="DEPARTED_CHINA">DEPARTED CHINA</option>
                          <option value="IN_TRANSIT">IN TRANSIT</option>
                          <option value="CUSTOMS_CLEARANCE">CUSTOMS CLEARANCE</option>
                          <option value="DELIVERED">DELIVERED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Financial Ledger */}
        {activeTab === 'ledger' && (
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-xs font-extrabold text-slate-900 uppercase">Platform NGN Financial Ledger</h2>

            <div className="space-y-2">
              {ledger.map((led) => (
                <div key={led.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-[#FF6600] font-bold block">{led.reference}</span>
                    <span className="font-bold text-slate-900">{led.description}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{new Date(led.createdAt).toLocaleString()}</span>
                  </div>

                  <span className={`font-black text-sm ${
                    led.type === 'PAYMENT_RECEIVED' ? 'text-emerald-600' : 'text-slate-500'
                  }`}>
                    {led.type === 'PAYMENT_RECEIVED' ? '+' : '-'}₦{led.amountNgn.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

