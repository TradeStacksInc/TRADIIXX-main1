import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  Manufacturer, 
  Product, 
  BuyerRequest, 
  Order, 
  AISettingConfig, 
  LedgerEntry, 
  AISourcingReport,
  Shipment,
  WarehouseInspection,
  PriceAlert
} from './types';

import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { MarketplaceSection } from './components/MarketplaceSection';
import { BuyRequestModal } from './components/BuyRequestModal';
import { AISourcingReportModal } from './components/AISourcingReportModal';
import { PaystackModal } from './components/PaystackModal';
import { OrderTrackingView } from './components/OrderTrackingView';
import { MerchandizerDashboard } from './components/MerchandizerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AiSupportDrawer } from './components/AiSupportDrawer';

export function App() {
  const [role, setRole] = useState<UserRole>('customer');
  const [activeTab, setActiveTab] = useState<string>('marketplace');

  // Application Data State
  const [settings, setSettings] = useState<AISettingConfig>({
    weightSpecificationMatch: 30,
    weightManufacturerReliability: 20,
    weightPriceSuitability: 20,
    weightMoqCompatibility: 10,
    weightLeadTime: 10,
    weightVerificationStatus: 10,
    platformMarginPercent: 5.5,
    cnyNgnExchangeRate: 215,
    autoApprovalThresholdNgn: 1500000
  });

  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [requests, setRequests] = useState<BuyerRequest[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [activeShipment, setActiveShipment] = useState<Shipment | null>(null);
  const [activeInspection, setActiveInspection] = useState<WarehouseInspection | null>(null);

  // Price Alerts State
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([
    {
      id: 'ALERT-001',
      requestId: 'REQ-2026-001',
      requestTitle: '4G Solar Powered PTZ Security CCTV Camera 1080P',
      targetPriceNgn: 135000,
      currentPriceNgn: 155000,
      notifyEmail: 'sleykingz@gmail.com',
      notifyPhone: '+234 803 892 1042',
      channel: 'BOTH',
      isActive: true,
      createdAt: new Date().toISOString()
    }
  ]);

  const handleSavePriceAlert = (alert: PriceAlert) => {
    setPriceAlerts(prev => {
      const exists = prev.some(a => a.id === alert.id || a.requestId === alert.requestId);
      if (exists) {
        return prev.map(a => (a.id === alert.id || a.requestId === alert.requestId) ? alert : a);
      }
      return [alert, ...prev];
    });
  };

  const handleDeletePriceAlert = (alertId: string) => {
    setPriceAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  // Modals & Drawers State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isPaystackModalOpen, setIsPaystackModalOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);

  const [activeReport, setActiveReport] = useState<AISourcingReport | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<BuyerRequest | null>(null);

  const [paystackData, setPaystackData] = useState<{
    amountNgn: number;
    productName: string;
    orderId: string;
    customerEmail: string;
  } | null>(null);

  const [initialSearchQuery, setInitialSearchQuery] = useState('');
  const [initialSearchUrl, setInitialSearchUrl] = useState('');

  // Initial Data Fetching from Server
  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => setSettings(d)).catch(console.error);
    fetch('/api/manufacturers').then(r => r.json()).then(d => setManufacturers(d)).catch(console.error);
    fetch('/api/products').then(r => r.json()).then(d => setProducts(d)).catch(console.error);
    fetch('/api/requests').then(r => r.json()).then(d => setRequests(d)).catch(console.error);
    fetch('/api/orders').then(r => r.json()).then(d => {
      setOrders(d);
      if (d.length > 0) {
        fetchOrderDetails(d[0].id);
      }
    }).catch(console.error);
    fetch('/api/ledger').then(r => r.json()).then(d => setLedger(d)).catch(console.error);
  }, []);

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();
      if (data.shipment) setActiveShipment(data.shipment);
      if (data.inspection) setActiveInspection(data.inspection);
    } catch (e) {
      console.error(e);
    }
  };

  // Trigger AI Sourcing for a request
  const handleStartSourcing = async (query: string, mediaFile?: File, productUrl?: string) => {
    setInitialSearchQuery(query);
    setInitialSearchUrl(productUrl || '');
    setIsCreateModalOpen(true);
  };

  // Submit new Buy Request & call AI Sourcing Engine
  const handleCreateRequest = async (requestData: any) => {
    try {
      // 1. Post request to server
      const reqRes = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
      const reqData = await reqRes.json();
      const newReq: BuyerRequest = reqData.request;

      setRequests(prev => [newReq, ...prev]);
      setSelectedRequest(newReq);

      // 2. Call AI Sourcing Engine
      const matchRes = await fetch('/api/ai/match-sourcing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: newReq.id,
          title: newReq.title,
          description: newReq.description,
          category: newReq.category,
          quantity: newReq.quantity,
          destinationCity: newReq.destinationCity,
          shippingPreference: newReq.shippingPreference
        })
      });

      const matchData = await matchRes.json();
      if (matchData.report) {
        setActiveReport(matchData.report);
        setIsReportModalOpen(true);
      }
    } catch (err) {
      console.error('Error creating buy request:', err);
    }
  };

  // Selecting a request from the marketplace to view AI report
  const handleSelectRequest = async (req: BuyerRequest) => {
    setSelectedRequest(req);

    // Call AI sourcing match
    const matchRes = await fetch('/api/ai/match-sourcing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestId: req.id,
        title: req.title,
        description: req.description,
        category: req.category,
        quantity: req.quantity,
        destinationCity: req.destinationCity,
        shippingPreference: req.shippingPreference
      })
    });
    const matchData = await matchRes.json();
    if (matchData.report) {
      setActiveReport(matchData.report);
      setIsReportModalOpen(true);
    }
  };

  // Accept Quote & Launch Paystack Checkout
  const handleAcceptQuote = (report: AISourcingReport, selectedProduct: Product, selectedManufacturer: Manufacturer) => {
    setIsReportModalOpen(false);
    const amount = report.suggestedLandedCost.totalLandedCostNgn;
    const ordId = `ORD-2026-${Math.floor(1000 + Math.random() * 8999)}`;

    setPaystackData({
      amountNgn: amount,
      productName: selectedProduct.productName,
      orderId: ordId,
      customerEmail: selectedRequest?.customerEmail || 'buyer@trader.ng'
    });

    setIsPaystackModalOpen(true);
  };

  // On Paystack Payment Success
  const handlePaymentSuccess = async (reference: string) => {
    if (!paystackData || !activeReport) return;

    try {
      const prod = activeReport.bestMatch.product;
      const mfg = activeReport.bestMatch.manufacturer;

      // Create Order on Backend
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteId: `q-${Date.now()}`,
          buyerRequestId: activeReport.buyerRequestId,
          customerName: selectedRequest?.customerName || 'Chidi Okafor',
          customerEmail: paystackData.customerEmail,
          productName: prod.productName,
          productImage: prod.productImages[0] || '',
          manufacturerName: mfg.companyName,
          quantity: selectedRequest?.quantity || 100,
          totalAmountNgn: paystackData.amountNgn,
          shippingMode: activeReport.suggestedLandedCost.shippingMode,
          destinationAddress: `${selectedRequest?.destinationCity || 'Lagos'}, Nigeria`
        })
      });

      const orderData = await orderRes.json();
      if (orderData.order) {
        setOrders(prev => [orderData.order, ...prev]);
        fetchOrderDetails(orderData.order.id);
        
        // Verify payment with paystack API route
        await fetch('/api/paystack/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reference,
            orderId: orderData.order.id,
            amountNgn: paystackData.amountNgn
          })
        });

        // Refresh ledger
        fetch('/api/ledger').then(r => r.json()).then(d => setLedger(d));
      }
    } catch (e) {
      console.error('Error post payment processing:', e);
    }
  };

  // Merchandizer Add Manufacturer
  const handleAddManufacturer = async (mfgData: Partial<Manufacturer>) => {
    const res = await fetch('/api/manufacturers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mfgData)
    });
    const data = await res.json();
    if (data.manufacturer) {
      setManufacturers(prev => [data.manufacturer, ...prev]);
    }
  };

  // Merchandizer Add Product
  const handleAddProduct = async (prodData: Partial<Product>) => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prodData)
    });
    const data = await res.json();
    if (data.product) {
      setProducts(prev => [data.product, ...prev]);
    }
  };

  // Merchandizer Bulk Import Products
  const handleBulkImportProducts = async (prods: Partial<Product>[]) => {
    const res = await fetch('/api/products/bulk-import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products: prods })
    });
    const data = await res.json();
    if (data.success) {
      fetch('/api/products').then(r => r.json()).then(d => setProducts(d));
    }
  };

  // Merchandizer AI Product Enrichment
  const handleEnrichProduct = async (name: string, desc: string) => {
    const res = await fetch('/api/ai/enrich-product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productName: name, description: desc })
    });
    const data = await res.json();
    return data.enriched;
  };

  // Admin Save Settings
  const handleSaveSettings = async (newSettings: AISettingConfig) => {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings)
    });
    const data = await res.json();
    if (data.settings) {
      setSettings(data.settings);
    }
  };

  // Admin Update Order Status
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        title: `Status Transition: ${status.replace('_', ' ')}`,
        description: `Order ${orderId} updated by Admin to ${status.replace('_', ' ')}`
      })
    });
    const data = await res.json();
    if (data.order) {
      setOrders(prev => prev.map(o => o.id === orderId ? data.order : o));
      if (data.shipment) setActiveShipment(data.shipment);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-slate-800 flex flex-col justify-between font-sans">
      <div>
        {/* Navigation Bar */}
        <Header
          role={role}
          setRole={setRole}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenCreateRequest={() => setIsCreateModalOpen(true)}
          onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
          cnyNgnRate={settings.cnyNgnExchangeRate}
        />

        {/* Main Content Body */}
        <main>
          {activeTab === 'marketplace' && (
            <>
              <HeroSearch
                onStartSourcing={handleStartSourcing}
                onOpenCreateRequest={() => setIsCreateModalOpen(true)}
              />

              <MarketplaceSection
                requests={requests}
                cnyNgnRate={settings.cnyNgnExchangeRate}
                priceAlerts={priceAlerts}
                onSavePriceAlert={handleSavePriceAlert}
                onDeletePriceAlert={handleDeletePriceAlert}
                onSelectRequest={handleSelectRequest}
                onOpenCreateRequest={() => setIsCreateModalOpen(true)}
              />
            </>
          )}

          {activeTab === 'tracking' && (
            <OrderTrackingView
              orders={orders}
              activeShipment={activeShipment}
              activeInspection={activeInspection}
              onSearchOrder={(ordId) => {
                const found = orders.find(o => o.id === ordId || o.trackingNumber === ordId);
                if (found) fetchOrderDetails(found.id);
              }}
            />
          )}

          {activeTab === 'merchandizer' && (
            <MerchandizerDashboard
              manufacturers={manufacturers}
              products={products}
              onAddManufacturer={handleAddManufacturer}
              onAddProduct={handleAddProduct}
              onBulkImportProducts={handleBulkImportProducts}
              onEnrichProduct={handleEnrichProduct}
            />
          )}

          {activeTab === 'admin' && (
            <AdminDashboard
              settings={settings}
              orders={orders}
              ledger={ledger}
              onSaveSettings={handleSaveSettings}
              onUpdateOrderStatus={handleUpdateOrderStatus}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white text-slate-500 text-xs py-6 border-t border-slate-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#FF6600] flex items-center justify-center text-white font-extrabold text-xs">
              TX
            </div>
            <span className="font-extrabold text-slate-900 text-sm">Tradiixx</span>
            <span>— China-to-Nigeria Import Engine</span>
          </div>

          <p className="text-xs text-slate-400 font-medium">
            "YOU FIND IT. OUR AI SOURCES IT. WE SHIP IT. YOU RECEIVE IT."
          </p>
        </div>
      </footer>

      {/* Modals & AI Assistants */}
      <BuyRequestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateRequest}
        initialQuery={initialSearchQuery}
        initialUrl={initialSearchUrl}
      />

      <AISourcingReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        report={activeReport}
        request={selectedRequest}
        onAcceptAndPay={handleAcceptQuote}
      />

      {paystackData && (
        <PaystackModal
          isOpen={isPaystackModalOpen}
          onClose={() => setIsPaystackModalOpen(false)}
          amountNgn={paystackData.amountNgn}
          productName={paystackData.productName}
          orderId={paystackData.orderId}
          customerEmail={paystackData.customerEmail}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      <AiSupportDrawer
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
      />
    </div>
  );
}

export default App;
