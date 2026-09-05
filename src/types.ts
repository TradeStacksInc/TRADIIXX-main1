export type UserRole = 'customer' | 'merchandizer' | 'admin';

export type VerificationStatus = 
  | 'UNVERIFIED' 
  | 'UNDER_REVIEW' 
  | 'VERIFIED' 
  | 'PREMIUM_VERIFIED' 
  | 'SUSPENDED';

export type ShippingMode = 'AIR_EXPRESS' | 'AIR_CARGO' | 'SEA_FREIGHT';

export type RequestStatus = 
  | 'PENDING_AI_ANALYSIS'
  | 'AI_SOURCING'
  | 'MATCH_FOUND'
  | 'QUOTE_READY'
  | 'ORDER_PLACED'
  | 'CANCELLED';

export type OrderStatus =
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'PROCUREMENT_STARTED'
  | 'ARRIVED_CHINA_WAREHOUSE'
  | 'QC_INSPECTION_PASSED'
  | 'QC_INSPECTION_FAILED'
  | 'DEPARTED_CHINA'
  | 'IN_TRANSIT'
  | 'ARRIVED_NIGERIA'
  | 'CUSTOMS_CLEARANCE'
  | 'CUSTOMS_CLEARED'
  | 'LOCAL_DELIVERY'
  | 'DELIVERED';

export type InspectionResult = 'PASSED' | 'PASSED_WITH_ISSUES' | 'FAILED';

export interface ManufacturerCapability {
  oem: boolean;
  odm: boolean;
  privateLabel: boolean;
  customPackaging: boolean;
  customBranding: boolean;
  smallBatch: boolean;
  massProduction: boolean;
}

export interface Manufacturer {
  id: string;
  companyName: string;
  companyNameChinese: string;
  manufacturerType: 'Factory' | 'Trading Company' | 'Direct Supplier';
  province: string;
  city: string;
  address: string;
  website?: string;
  supplierUrls: string[];
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  categories: string[];
  specializations: string[];
  factorySize: string; // e.g. "15,000 sqm"
  productionCapacity: string; // e.g. "50,000 units/month"
  minimumOrderQuantity: number;
  averageLeadTimeDays: number;
  verificationStatus: VerificationStatus;
  verificationDate?: string;
  yearsInBusiness?: number; // e.g. 14 years in operation
  isoCertifications?: string[]; // e.g. ['ISO 9001', 'ISO 14001', 'CE']
  rating: number; // 1-5
  internalScore: number; // 1-100
  capabilities: ManufacturerCapability;
  businessLicenseNo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "4G Solar CCTV - 128GB"
  sku: string;
  priceCny: number;
  moq: number;
  specifications: Record<string, string>;
}

export interface Product {
  id: string;
  manufacturerId: string;
  manufacturerName?: string;
  manufacturerVerified?: boolean;
  productName: string;
  productNameChinese: string;
  category: string;
  subcategory: string;
  description: string;
  specifications: Record<string, string>;
  modelNumber: string;
  sku: string;
  moq: number;
  unit: string; // e.g. "units", "pairs", "sets"
  supplierPriceCny: number;
  priceRangeCny?: string;
  priceLastUpdated: string;
  productionLeadTimeDays: number;
  productImages: string[];
  productVideos?: string[];
  supplierUrl: string;
  verificationStatus: VerificationStatus;
  availabilityStatus: 'IN_STOCK' | 'MADE_TO_ORDER' | 'OUT_OF_STOCK';
  aiSearchTags: string[];
  weightKg?: number;
  cbm?: number;
  variants?: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface BuyerRequestMedia {
  type: 'image' | 'video' | 'document';
  url: string;
  name: string;
}

export interface BuyerRequest {
  id: string;
  customerName: string;
  customerEmail: string;
  title: string;
  description: string;
  category: string;
  quantity: number;
  targetBudgetNgn?: number;
  destinationCity: string; // e.g. "Lagos", "Abuja", "Kano", "Onitsha"
  shippingPreference: ShippingMode;
  media: BuyerRequestMedia[];
  productUrls?: string[];
  extractedSpecs?: Record<string, string>;
  status: RequestStatus;
  aiSourcingResultId?: string;
  createdAt: string;
}

export interface AISourcingMatch {
  product: Product;
  manufacturer: Manufacturer;
  matchScore: number; // 0-100
  compatibilityBreakdown: {
    specifications: number;
    moq: number;
    price: number;
    verification: number;
    leadTime: number;
  };
  whyRecommended: string[];
}

export interface LandedCostBreakdown {
  productCostCny: number;
  productCostNgn: number;
  procurementFeeNgn: number;
  chinaWarehouseFeeNgn: number;
  internationalShippingNgn: number;
  estimatedCustomsNgn: number;
  localDeliveryNgn: number;
  platformServiceFeeNgn: number;
  totalLandedCostNgn: number;
  exchangeRateNgnCny: number; // e.g. 215 NGN per 1 CNY
  weightKgEst: number;
  cbmEst: number;
  shippingMode: ShippingMode;
}

export interface AISourcingReport {
  id: string;
  buyerRequestId: string;
  confidenceScore: number; // 0-100
  bestMatch: AISourcingMatch;
  alternatives: {
    label: string; // "Best Quality" | "Best Value" | "Lowest Cost"
    match: AISourcingMatch;
    landedCostNgn: number;
  }[];
  suggestedLandedCost: LandedCostBreakdown;
  aiExplanation: string;
  requiresHumanApproval: boolean; // if total > threshold
  humanApprovedBy?: string;
  humanApprovedAt?: string;
  createdAt: string;
}

export interface Quote {
  id: string;
  buyerRequestId: string;
  buyerTitle: string;
  customerName: string;
  customerEmail: string;
  selectedProductId: string;
  selectedManufacturerId: string;
  quantity: number;
  landedCost: LandedCostBreakdown;
  status: 'DRAFT' | 'ACTIVE' | 'ACCEPTED' | 'EXPIRED';
  validUntil: string;
  createdAt: string;
}

export interface Order {
  id: string; // e.g. "ORD-2026-9042"
  quoteId: string;
  buyerRequestId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  productName: string;
  productImage: string;
  manufacturerName: string;
  quantity: number;
  totalAmountNgn: number;
  shippingMode: ShippingMode;
  destinationAddress: string;
  status: OrderStatus;
  trackingNumber: string; // e.g. "SN-NGA-882910"
  procurementOrderId?: string;
  chinaWarehouseReceiptId?: string;
  shipmentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProcurementOrder {
  id: string; // e.g. "PO-2026-00184"
  orderId: string;
  manufacturerId: string;
  manufacturerName: string;
  productName: string;
  quantity: number;
  unitPriceCny: number;
  totalPriceCny: number;
  supplierContact: string;
  expectedDeliveryToWarehouse: string;
  status: 'ISSUED' | 'CONFIRMED' | 'IN_PRODUCTION' | 'SHIPPED_TO_WAREHOUSE' | 'DELIVERED_TO_WAREHOUSE';
  createdAt: string;
}

export interface WarehouseInspection {
  id: string;
  procurementOrderId: string;
  orderId: string;
  warehouseLocation: string; // e.g. "Guangzhou Baiyun Logistics Hub A4"
  receivedQuantity: number;
  inspectedQuantity: number;
  defectCount: number;
  result: InspectionResult;
  inspectionPhotos: string[];
  inspectorNotes: string;
  inspectedAt: string;
}

export interface TrackingEvent {
  id: string;
  timestamp: string;
  status: OrderStatus;
  title: string;
  location: string;
  description: string;
  photoUrl?: string;
}

export interface Shipment {
  id: string; // e.g. "SHP-2026-7731"
  orderId: string;
  carrier: string; // e.g. "Tradiixx Express Cargo", "Maersk Line"
  shippingMode: ShippingMode;
  origin: string; // "Guangzhou, China"
  destination: string; // "Lagos, Nigeria"
  weightKg: number;
  cbm: number;
  containerNo?: string;
  billOfLading?: string;
  departureDate: string;
  estimatedArrivalDate: string;
  actualArrivalDate?: string;
  trackingEvents: TrackingEvent[];
}

export interface AISettingConfig {
  weightSpecificationMatch: number; // e.g. 30
  weightManufacturerReliability: number; // e.g. 20
  weightPriceSuitability: number; // e.g. 20
  weightMoqCompatibility: number; // e.g. 10
  weightLeadTime: number; // e.g. 10
  weightVerificationStatus: number; // e.g. 10
  platformMarginPercent: number; // e.g. 5.0
  cnyNgnExchangeRate: number; // e.g. 215
  autoApprovalThresholdNgn: number; // e.g. 1000000 (orders above 1M NGN require Admin/Merchandizer approval)
}

export interface LedgerEntry {
  id: string;
  orderId: string;
  type: 'PAYMENT_RECEIVED' | 'PROCUREMENT_PAID' | 'FREIGHT_PAID' | 'CUSTOMS_PAID' | 'REFUND';
  amountNgn: number;
  description: string;
  reference: string;
  createdAt: string;
}

export interface PriceAlert {
  id: string;
  requestId: string;
  requestTitle: string;
  targetPriceNgn: number;
  currentPriceNgn: number;
  notifyEmail: string;
  notifyPhone?: string;
  channel: 'EMAIL' | 'WHATSAPP' | 'BOTH';
  isActive: boolean;
  createdAt: string;
  triggeredCount?: number;
  lastTriggeredAt?: string;
}

export interface BatchOptimizationBundle {
  id: string;
  bundleName: string;
  hubLocation: string; // e.g. "Shenzhen Baoan Consolidation Hub" or "Guangzhou Baiyun Freight Depot"
  destinationCity: string; // e.g. "Lagos (Apapa Sea Port)" or "Abuja Air Cargo"
  requestIds: string[];
  requestTitles: string[];
  shippingMode: ShippingMode;
  totalQuantity: number;
  totalWeightKgEst: number;
  totalCbmEst: number;
  individualFreightCostNgn: number;
  consolidatedFreightCostNgn: number;
  savingsNgn: number;
  savingsPercent: number;
  transitDaysEst: number;
  recommendationReason: string;
}

export interface BatchOptimizationPlan {
  id: string;
  totalRequestsAnalyzed: number;
  totalCurrentFreightNgn: number;
  totalOptimizedFreightNgn: number;
  totalNetSavingsNgn: number;
  totalSavingsPercent: number;
  bundles: BatchOptimizationBundle[];
  generatedAt: string;
}

