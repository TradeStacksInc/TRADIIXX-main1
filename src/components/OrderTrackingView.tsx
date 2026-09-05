import React, { useState } from 'react';
import { Order, Shipment, WarehouseInspection } from '../types';
import { 
  Package, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Ship, 
  ShieldCheck, 
  Search
} from 'lucide-react';

interface OrderTrackingViewProps {
  orders: Order[];
  activeShipment?: Shipment | null;
  activeInspection?: WarehouseInspection | null;
  onSearchOrder: (orderIdOrTracking: string) => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  orders,
  activeShipment,
  activeInspection,
  onSearchOrder
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order>(orders[0] || null);

  const steps = [
    { key: 'PAID', label: 'Payment Confirmed' },
    { key: 'PROCUREMENT_STARTED', label: 'China Factory PO' },
    { key: 'ARRIVED_CHINA_WAREHOUSE', label: 'China Warehouse' },
    { key: 'QC_INSPECTION_PASSED', label: 'QC Inspection' },
    { key: 'DEPARTED_CHINA', label: 'Departed China' },
    { key: 'IN_TRANSIT', label: 'In Transit' },
    { key: 'ARRIVED_NIGERIA', label: 'Arrived Nigeria' },
    { key: 'CUSTOMS_CLEARANCE', label: 'Customs Clearance' },
    { key: 'DELIVERED', label: 'Delivered' }
  ];

  const getCurrentStepIndex = (status: string) => {
    switch (status) {
      case 'PAID': return 0;
      case 'PROCUREMENT_STARTED': return 1;
      case 'ARRIVED_CHINA_WAREHOUSE': return 2;
      case 'QC_INSPECTION_PASSED': return 3;
      case 'DEPARTED_CHINA': return 4;
      case 'IN_TRANSIT': return 5;
      case 'ARRIVED_NIGERIA': return 6;
      case 'CUSTOMS_CLEARANCE': return 7;
      case 'CUSTOMS_CLEARED': return 7;
      case 'LOCAL_DELIVERY': return 8;
      case 'DELIVERED': return 8;
      default: return 0;
    }
  };

  const currentStep = selectedOrder ? getCurrentStepIndex(selectedOrder.status) : 0;

  return (
    <div className="py-8 bg-[#F4F5F7] text-slate-800 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#FF6600] uppercase tracking-wider mb-1">
              <Truck className="w-4 h-4" />
              <span>LOGISTICS CONTROL CENTER</span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Track China-to-Nigeria Shipments
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter tracking code or order ref for warehouse inspection photos & customs status
            </p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-80 font-sans">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="SN-NGA-882910 or ORD-2026-9042"
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF6600]"
              />
            </div>
            <button
              onClick={() => onSearchOrder(searchInput)}
              className="px-4 py-1.5 bg-[#FF6600] hover:bg-orange-600 text-white font-bold text-xs rounded-lg transition-all shrink-0 cursor-pointer shadow-sm"
            >
              SEARCH
            </button>
          </div>
        </div>

        {/* Order Selector Chips */}
        {orders.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-5 scrollbar-none">
            {orders.map((ord) => (
              <button
                key={ord.id}
                onClick={() => setSelectedOrder(ord)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedOrder?.id === ord.id
                    ? 'bg-[#FF6600] text-white border-[#FF6600] shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="text-left">
                  <span className={`block text-[10px] font-bold ${selectedOrder?.id === ord.id ? 'text-orange-100' : 'text-[#FF6600]'}`}>
                    {ord.trackingNumber}
                  </span>
                  <span className="block truncate max-w-[150px]">{ord.productName}</span>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-extrabold ${selectedOrder?.id === ord.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {ord.status.replace('_', ' ')}
                </span>
              </button>
            ))}
          </div>
        )}

        {selectedOrder ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column: Progress Stepper & Tracking Timeline */}
            <div className="lg:col-span-8 space-y-5">
              {/* Stepper Card */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 mb-5">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#FF6600] tracking-wider">TRACKING ID</span>
                    <h3 className="font-extrabold text-lg text-slate-900">{selectedOrder.trackingNumber}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">CARRIER ROUTE</span>
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1 justify-end">
                      <Ship className="w-3.5 h-3.5 text-[#FF6600]" />
                      Guangzhou → Lagos Hub
                    </span>
                  </div>
                </div>

                {/* Visual Horizontal Progress Stepper */}
                <div className="relative my-4 px-1">
                  <div className="overflow-x-auto pb-3 scrollbar-none">
                    <div className="flex items-center justify-between min-w-[650px] relative">
                      {/* Connecting Line */}
                      <div className="absolute top-3.5 left-5 right-5 h-0.5 bg-slate-200 -z-0"></div>
                      <div 
                        className="absolute top-3.5 left-5 h-0.5 bg-[#FF6600] transition-all duration-500 -z-0"
                        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                      ></div>

                      {steps.map((st, idx) => {
                        const isCompleted = idx <= currentStep;
                        const isCurrent = idx === currentStep;

                        return (
                          <div key={st.key} className="flex flex-col items-center relative z-10 w-20 text-center">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isCompleted 
                                ? 'bg-[#FF6600] text-white shadow-sm' 
                                : 'bg-slate-100 border border-slate-200 text-slate-400'
                            }`}>
                              {isCompleted ? <CheckCircle2 className="w-4 h-4 text-white" /> : idx + 1}
                            </div>
                            <span className={`text-[9px] font-bold mt-1.5 leading-tight ${
                              isCurrent ? 'text-[#FF6600] font-black' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                            }`}>
                              {st.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Timeline Event Logs */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-3">
                    SHIPMENT EVENT LOG
                  </h4>

                  <div className="space-y-3">
                    {(activeShipment?.trackingEvents || []).map((evt, idx) => (
                      <div key={evt.id} className="flex gap-3 items-start">
                        <div className="flex flex-col items-center">
                          <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${
                            idx === 0 ? 'bg-[#FF6600]' : 'bg-slate-300'
                          }`}></div>
                          {idx !== (activeShipment?.trackingEvents.length || 0) - 1 && (
                            <div className="w-0.5 h-10 bg-slate-200 my-1"></div>
                          )}
                        </div>

                        <div className="flex-1 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-slate-900">{evt.title}</span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(evt.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-slate-600 mb-1 text-[11px]">{evt.description}</p>
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                            <MapPin className="w-3 h-3 text-[#FF6600]" />
                            {evt.location}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Warehouse Inspection & Details */}
            <div className="lg:col-span-4 space-y-5">
              {/* Warehouse Inspection Photos Card */}
              {activeInspection && (
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#FF6600]" />
                      <h4 className="font-bold text-slate-900 text-xs">Guangzhou Warehouse QC</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {activeInspection.result}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 italic">
                    "{activeInspection.inspectorNotes}"
                  </p>

                  <div className="space-y-1 pt-1">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Inspection Photos</span>
                    <div className="grid grid-cols-2 gap-2">
                      {activeInspection.inspectionPhotos.map((photo, pIdx) => (
                        <div key={pIdx} className="h-20 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                          <img
                            src={photo}
                            alt="Warehouse Inspection"
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 text-[10px] text-slate-500 border-t border-slate-100 flex justify-between font-bold">
                    <span>Location: {activeInspection.warehouseLocation.split(',')[0]}</span>
                    <span className="text-emerald-600">100% VERIFIED</span>
                  </div>
                </div>
              )}

              {/* Order Info & Delivery Details */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
                <div className="border-b border-slate-100 pb-2.5">
                  <span className="text-[10px] font-bold text-[#FF6600] uppercase tracking-wider block">DELIVERY DESTINATION</span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">{selectedOrder.customerName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedOrder.destinationAddress}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">SHIPPING MODE</span>
                    <span className="font-bold text-slate-800">{selectedOrder.shippingMode.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">TOTAL PAID</span>
                    <span className="font-black text-[#FF6600]">₦{selectedOrder.totalAmountNgn.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
            <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h3 className="text-xs font-bold text-slate-800">No active orders found</h3>
            <p className="text-[11px] text-slate-500 mt-1">Submit a buy request to generate an AI sourcing quote.</p>
          </div>
        )}
      </div>
    </div>
  );
};

