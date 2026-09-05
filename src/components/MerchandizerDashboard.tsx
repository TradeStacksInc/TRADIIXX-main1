import React, { useState } from 'react';
import { Manufacturer, Product, VerificationStatus } from '../types';
import { ManufacturerBadges } from './ManufacturerBadges';
import { 
  Building2, 
  Plus, 
  Search, 
  FileSpreadsheet, 
  ExternalLink, 
  Sparkles,
  X,
  Star,
  Award,
  ShieldCheck
} from 'lucide-react';

interface MerchandizerDashboardProps {
  manufacturers: Manufacturer[];
  products: Product[];
  onAddManufacturer: (mfg: Partial<Manufacturer>) => Promise<void>;
  onAddProduct: (prod: Partial<Product>) => Promise<void>;
  onBulkImportProducts: (prods: Partial<Product>[]) => Promise<void>;
  onEnrichProduct: (name: string, desc: string) => Promise<any>;
}

export const MerchandizerDashboard: React.FC<MerchandizerDashboardProps> = ({
  manufacturers,
  products,
  onAddManufacturer,
  onAddProduct,
  onBulkImportProducts,
  onEnrichProduct
}) => {
  const [activeTab, setActiveTab] = useState<'manufacturers' | 'products' | 'bulk'>('manufacturers');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddMfgModal, setShowAddMfgModal] = useState(false);
  const [showAddProdModal, setShowAddProdModal] = useState(false);

  // New Manufacturer Form State
  const [newMfgName, setNewMfgName] = useState('');
  const [newMfgNameCn, setNewMfgNameCn] = useState('');
  const [newMfgCity, setNewMfgCity] = useState('Shenzhen');
  const [newMfgProvince, setNewMfgProvince] = useState('Guangdong');
  const [newMfgAddress, setNewMfgAddress] = useState('');
  const [newMfgSupplierUrl, setNewMfgSupplierUrl] = useState('');
  const [newMfgMoq, setNewMfgMoq] = useState(100);
  const [newMfgLeadTime, setNewMfgLeadTime] = useState(15);
  const [newMfgVerif, setNewMfgVerif] = useState<VerificationStatus>('VERIFIED');
  const [newMfgCategory, setNewMfgCategory] = useState('Security & Surveillance');
  const [newMfgYearsExp, setNewMfgYearsExp] = useState(10);
  const [newMfgIsoCerts, setNewMfgIsoCerts] = useState('ISO 9001, CE Certified');

  // New Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdNameCn, setNewProdNameCn] = useState('');
  const [newProdMfgId, setNewProdMfgId] = useState(manufacturers[0]?.id || '');
  const [newProdCategory, setNewProdCategory] = useState('Security & Surveillance');
  const [newProdPriceCny, setNewProdPriceCny] = useState(150);
  const [newProdMoq, setNewProdMoq] = useState(50);
  const [newProdLeadTime, setNewProdLeadTime] = useState(12);
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImg, setNewProdImg] = useState('https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&auto=format&fit=crop&q=80');
  const [isEnriching, setIsEnriching] = useState(false);

  // Bulk Import CSV file state
  const [csvText, setCsvText] = useState('');

  const filteredMfg = manufacturers.filter(m => 
    !searchQuery || 
    m.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProd = products.filter(p => 
    !searchQuery || 
    p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateMfg = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddManufacturer({
      companyName: newMfgName,
      companyNameChinese: newMfgNameCn || '精选制造企业',
      city: newMfgCity,
      province: newMfgProvince,
      address: newMfgAddress || `${newMfgCity}, ${newMfgProvince}, China`,
      manufacturerType: 'Factory',
      supplierUrls: newMfgSupplierUrl ? [newMfgSupplierUrl] : ['https://1688.com'],
      contactPerson: 'Director of Overseas Export',
      contactEmail: 'export@factory.cn',
      contactPhone: '+86 755 8890 0000',
      categories: [newMfgCategory],
      specializations: [newMfgCategory],
      factorySize: '15,000 sqm',
      productionCapacity: '100,000 units/month',
      minimumOrderQuantity: newMfgMoq,
      averageLeadTimeDays: newMfgLeadTime,
      verificationStatus: newMfgVerif,
      yearsInBusiness: Number(newMfgYearsExp) || 10,
      isoCertifications: newMfgIsoCerts ? newMfgIsoCerts.split(',').map(c => c.trim()) : ['ISO 9001', 'CE Certified'],
      rating: 4.8,
      internalScore: 92,
      capabilities: {
        oem: true, odm: true, privateLabel: true, customPackaging: true, customBranding: true, smallBatch: true, massProduction: true
      }
    });
    setShowAddMfgModal(false);
  };

  const handleCreateProd = async (e: React.FormEvent) => {
    e.preventDefault();
    const mfg = manufacturers.find(m => m.id === newProdMfgId) || manufacturers[0];
    await onAddProduct({
      manufacturerId: mfg.id,
      manufacturerName: mfg.companyName,
      manufacturerVerified: mfg.verificationStatus === 'VERIFIED' || mfg.verificationStatus === 'PREMIUM_VERIFIED',
      productName: newProdName,
      productNameChinese: newProdNameCn || '高品质中国出口商品',
      category: newProdCategory,
      subcategory: 'General',
      description: newProdDesc || 'Export quality product directly from verified Chinese manufacturer.',
      modelNumber: `MOD-${Date.now().toString().slice(-4)}`,
      sku: `SKU-${Date.now().toString().slice(-4)}`,
      moq: Number(newProdMoq),
      unit: 'units',
      supplierPriceCny: Number(newProdPriceCny),
      priceLastUpdated: new Date().toISOString().split('T')[0],
      productionLeadTimeDays: Number(newProdLeadTime),
      productImages: [newProdImg],
      supplierUrl: mfg.supplierUrls[0] || 'https://1688.com',
      verificationStatus: mfg.verificationStatus,
      availabilityStatus: 'IN_STOCK',
      aiSearchTags: [newProdName.toLowerCase(), newProdCategory.toLowerCase(), 'china import', 'wholesale']
    });
    setShowAddProdModal(false);
  };

  const handleEnrichWithAi = async () => {
    if (!newProdName) return;
    setIsEnriching(true);
    try {
      const res = await onEnrichProduct(newProdName, newProdDesc);
      if (res) {
        if (res.productNameChinese) setNewProdNameCn(res.productNameChinese);
        if (res.category) setNewProdCategory(res.category);
        if (res.summary) setNewProdDesc(res.summary);
      }
      setIsEnriching(false);
    } catch (e) {
      setIsEnriching(false);
    }
  };

  const handleCsvImportSubmit = async () => {
    if (!csvText) return;
    const lines = csvText.split('\n').filter(l => l.trim().length > 0);
    const parsed: Partial<Product>[] = [];

    lines.slice(1).forEach((line, idx) => {
      const parts = line.split(',');
      if (parts.length >= 4) {
        parsed.push({
          manufacturerId: manufacturers[0]?.id || 'mfg-101',
          manufacturerName: parts[0]?.trim() || manufacturers[0]?.companyName,
          productName: parts[1]?.trim() || 'Wholesale Product',
          productNameChinese: '批量进口商品',
          category: parts[2]?.trim() || 'General',
          subcategory: 'Bulk Import',
          description: 'Imported via Merchandizer CSV bulk parser.',
          modelNumber: `BULK-${idx + 100}`,
          sku: `BULK-SKU-${idx + 100}`,
          moq: Number(parts[3]) || 50,
          unit: 'units',
          supplierPriceCny: Number(parts[4]) || 100,
          priceLastUpdated: new Date().toISOString().split('T')[0],
          productionLeadTimeDays: 14,
          productImages: ['https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&auto=format&fit=crop&q=80'],
          supplierUrl: 'https://1688.com',
          verificationStatus: 'VERIFIED',
          availabilityStatus: 'IN_STOCK',
          aiSearchTags: [parts[1]?.toLowerCase() || 'bulk']
        });
      }
    });

    if (parsed.length > 0) {
      await onBulkImportProducts(parsed);
      setCsvText('');
      setActiveTab('products');
    }
  };

  return (
    <div className="py-8 bg-[#F4F5F7] text-slate-800 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Merchandizer Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#FF6600] uppercase tracking-wider mb-1">
              <Building2 className="w-4 h-4" />
              <span>FACTORY & INTEL CATALOG</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Merchandizer Supplier Intelligence
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Index Chinese factories, 1688 products, FOB prices & audit records
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAddMfgModal(true)}
              className="flex items-center gap-1.5 bg-[#FF6600] hover:bg-orange-600 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Factory</span>
            </button>

            <button
              onClick={() => setShowAddProdModal(true)}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">INDEXED FACTORIES</span>
            <span className="text-2xl font-extrabold text-slate-900">{manufacturers.length}</span>
            <span className="text-[10px] text-[#FF6600] font-bold block mt-0.5">Shenzhen • Guangzhou • Yiwu</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">INDEXED SKUS</span>
            <span className="text-2xl font-extrabold text-slate-900">{products.length}</span>
            <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">AI Cataloging Active</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">VERIFIED AUDITED</span>
            <span className="text-2xl font-extrabold text-emerald-600">
              {manufacturers.filter(m => m.verificationStatus === 'VERIFIED' || m.verificationStatus === 'PREMIUM_VERIFIED').length}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Passed Factory Audit</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">FX FRESHNESS</span>
            <span className="text-2xl font-extrabold text-[#FF6600]">100%</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Live Exchange Rate</span>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex items-center justify-between gap-3 mb-5 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('manufacturers')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'manufacturers' ? 'bg-[#FF6600] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Factories ({manufacturers.length})
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'products' ? 'bg-[#FF6600] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Catalog ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('bulk')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === 'bulk' ? 'bg-[#FF6600] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Bulk CSV Import</span>
            </button>
          </div>

          <div className="relative shrink-0 w-60">
            <Search className="w-4 h-4 absolute left-3 top-2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter intel..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF6600]"
            />
          </div>
        </div>

        {/* Manufacturers View */}
        {activeTab === 'manufacturers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMfg.map((mfg) => (
              <div key={mfg.id} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3 relative group">
                {/* Header Title & Rating */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-sm">{mfg.companyName}</h3>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{mfg.rating}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{mfg.companyNameChinese} • {mfg.city}, {mfg.province}</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                    SCORE: {mfg.internalScore}/100
                  </span>
                </div>

                {/* Visual Badges for Verified Supplier, Years Experience, and ISO Certifications */}
                <div className="pt-1 pb-1 border-y border-slate-100">
                  <ManufacturerBadges manufacturer={mfg} />
                </div>

                {/* Key Factory Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 text-center p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block">FACTORY SIZE</span>
                    <span className="font-bold text-slate-800">{mfg.factorySize}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block">LEAD TIME</span>
                    <span className="font-bold text-slate-800">{mfg.averageLeadTimeDays} Days</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block">MIN ORDER</span>
                    <span className="font-bold text-slate-800">{mfg.minimumOrderQuantity} Units</span>
                  </div>
                </div>

                {/* Specializations & Capabilities Tags */}
                <div className="flex flex-wrap gap-1 text-[9px]">
                  {mfg.capabilities.oem && <span className="bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">OEM</span>}
                  {mfg.capabilities.odm && <span className="bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">ODM</span>}
                  {mfg.capabilities.privateLabel && <span className="bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">PRIVATE LABEL</span>}
                  {mfg.specializations?.slice(0, 2).map((spec) => (
                    <span key={spec} className="bg-orange-50 text-[#FF6600] border border-orange-200 px-2 py-0.5 rounded font-bold">
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Card Footer */}
                <div className="text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="truncate max-w-[200px]">Contact: {mfg.contactPerson}</span>
                  <a
                    href={mfg.supplierUrls[0] || 'https://1688.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#FF6600] font-bold flex items-center gap-1 hover:underline shrink-0"
                  >
                    <span>1688 Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products View */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProd.map((prod) => (
              <div key={prod.id} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="h-36 rounded-lg overflow-hidden bg-slate-100 mb-2.5 border border-slate-200">
                    <img
                      src={prod.productImages[0]}
                      alt={prod.productName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <span className="text-[9px] font-bold uppercase bg-orange-50 text-[#FF6600] px-2 py-0.5 rounded border border-orange-200">
                    {prod.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-xs mt-1.5 line-clamp-2">{prod.productName}</h3>
                  <p className="text-[10px] text-slate-400 italic mb-2">{prod.productNameChinese}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold block">FOB PRICE</span>
                    <span className="font-extrabold text-[#FF6600]">¥{prod.supplierPriceCny} CNY</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 font-bold block">MOQ</span>
                    <span className="font-bold text-slate-800">{prod.moq} {prod.unit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bulk CSV Import View */}
        {activeTab === 'bulk' && (
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Bulk Factory Catalog CSV Parser</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Batch import 1688 / Taobao / Supplier products directly into system catalog.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5">
              <span className="font-bold text-slate-700 block">EXPECTED CSV FORMAT:</span>
              <code className="block bg-white text-slate-800 p-2.5 rounded border border-slate-200 text-[11px] font-mono">
                Manufacturer,ProductName,Category,MOQ,PriceCNY<br />
                Shenzhen Security Vision,4G Solar CCTV Camera,Security & Surveillance,50,165<br />
                Guangzhou Footwear,Men Running Sneakers,Fashion & Footwear,200,42
              </code>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">PASTE CSV DATA</label>
              <textarea
                rows={5}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="Paste CSV rows here..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#FF6600] resize-none"
              />
            </div>

            <button
              onClick={handleCsvImportSubmit}
              disabled={!csvText.trim()}
              className="bg-[#FF6600] hover:bg-orange-600 text-white font-bold text-xs px-5 py-2 rounded-lg transition-all disabled:opacity-50 cursor-pointer shadow-sm"
            >
              PARSE & IMPORT CATALOG
            </button>
          </div>
        )}

        {/* Add Manufacturer Modal */}
        {showAddMfgModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl relative my-8 text-slate-800">
              <button
                onClick={() => setShowAddMfgModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>

              <h2 className="text-base font-extrabold text-slate-900 mb-3">Add Chinese Manufacturer</h2>

              <form onSubmit={handleCreateMfg} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">COMPANY NAME (EN)</label>
                  <input
                    type="text"
                    required
                    value={newMfgName}
                    onChange={(e) => setNewMfgName(e.target.value)}
                    placeholder="Shenzhen Tech Vision Co., Ltd."
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#FF6600]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">COMPANY NAME (CN)</label>
                  <input
                    type="text"
                    value={newMfgNameCn}
                    onChange={(e) => setNewMfgNameCn(e.target.value)}
                    placeholder="深圳市科技视觉有限公司"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#FF6600]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">CITY</label>
                    <input
                      type="text"
                      value={newMfgCity}
                      onChange={(e) => setNewMfgCity(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#FF6600]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">AUDIT STATUS</label>
                    <select
                      value={newMfgVerif}
                      onChange={(e) => setNewMfgVerif(e.target.value as VerificationStatus)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#FF6600] cursor-pointer"
                    >
                      <option value="VERIFIED">VERIFIED</option>
                      <option value="PREMIUM_VERIFIED">PREMIUM VERIFIED</option>
                      <option value="UNDER_REVIEW">UNDER REVIEW</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">YEARS IN OPERATION</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={newMfgYearsExp}
                      onChange={(e) => setNewMfgYearsExp(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#FF6600]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">CERTIFICATIONS</label>
                    <input
                      type="text"
                      value={newMfgIsoCerts}
                      onChange={(e) => setNewMfgIsoCerts(e.target.value)}
                      placeholder="ISO 9001, CE Certified, RoHS"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#FF6600]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">1688 SUPPLIER URL</label>
                  <input
                    type="url"
                    value={newMfgSupplierUrl}
                    onChange={(e) => setNewMfgSupplierUrl(e.target.value)}
                    placeholder="https://1688.com/factory/..."
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#FF6600]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#FF6600] hover:bg-orange-600 text-white font-bold text-xs py-2.5 rounded-lg transition-all mt-3 cursor-pointer shadow-sm"
                >
                  SAVE MANUFACTURER RECORD
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddProdModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl relative my-8 text-slate-800">
              <button
                onClick={() => setShowAddProdModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>

              <h2 className="text-base font-extrabold text-slate-900 mb-3">Add Product to Catalog</h2>

              <form onSubmit={handleCreateProd} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">MANUFACTURER</label>
                  <select
                    value={newProdMfgId}
                    onChange={(e) => setNewProdMfgId(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#FF6600] cursor-pointer"
                  >
                    {manufacturers.map(m => (
                      <option key={m.id} value={m.id}>{m.companyName} ({m.city})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">PRODUCT NAME (EN)</label>
                    <button
                      type="button"
                      onClick={handleEnrichWithAi}
                      disabled={isEnriching || !newProdName}
                      className="text-[10px] font-bold text-[#FF6600] flex items-center gap-1 hover:underline disabled:opacity-50 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-[#FF6600]" />
                      <span>{isEnriching ? 'Enriching...' : 'AI Chinese Name'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="4G Solar CCTV Camera"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#FF6600]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">PRICE (CNY ¥)</label>
                    <input
                      type="number"
                      required
                      value={newProdPriceCny}
                      onChange={(e) => setNewProdPriceCny(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#FF6600]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">MOQ</label>
                    <input
                      type="number"
                      required
                      value={newProdMoq}
                      onChange={(e) => setNewProdMoq(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#FF6600]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">IMAGE URL</label>
                  <input
                    type="url"
                    value={newProdImg}
                    onChange={(e) => setNewProdImg(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#FF6600]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#FF6600] hover:bg-orange-600 text-white font-bold text-xs py-2.5 rounded-lg transition-all mt-3 cursor-pointer shadow-sm"
                >
                  SAVE PRODUCT RECORD
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

