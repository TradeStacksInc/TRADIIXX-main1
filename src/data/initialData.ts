import { 
  Manufacturer, 
  Product, 
  BuyerRequest, 
  Order, 
  AISettingConfig, 
  LedgerEntry,
  Shipment,
  WarehouseInspection
} from '../types';

export const INITIAL_AI_SETTINGS: AISettingConfig = {
  weightSpecificationMatch: 30,
  weightManufacturerReliability: 20,
  weightPriceSuitability: 20,
  weightMoqCompatibility: 10,
  weightLeadTime: 10,
  weightVerificationStatus: 10,
  platformMarginPercent: 5.5,
  cnyNgnExchangeRate: 215, // 1 CNY = 215 NGN
  autoApprovalThresholdNgn: 1500000, // ₦1.5M
};

export const INITIAL_MANUFACTURERS: Manufacturer[] = [
  {
    id: 'mfg-101',
    companyName: 'Shenzhen Security Vision Technology Co., Ltd.',
    companyNameChinese: '深圳市安视科技有限公司',
    manufacturerType: 'Factory',
    province: 'Guangdong',
    city: 'Shenzhen',
    address: 'Bldg B, High-Tech Industrial Park, Nanshan District, Shenzhen',
    website: 'https://szsecurityvision.example.cn',
    supplierUrls: ['https://1688.com/factory/szsecurityvision', 'https://alibaba.com/szsecurityvision'],
    contactPerson: 'Chen Wei (Director of Overseas Sales)',
    contactEmail: 'chen.wei@securityvision.cn',
    contactPhone: '+86 755 8892 3411',
    categories: ['Security & Surveillance', 'Smart Home', 'Electronics'],
    specializations: ['Solar CCTV Cameras', 'Wireless IP Cameras', 'NVR Systems', 'Smart Doorbells'],
    factorySize: '22,000 sqm',
    productionCapacity: '120,000 units/month',
    minimumOrderQuantity: 50,
    averageLeadTimeDays: 12,
    verificationStatus: 'PREMIUM_VERIFIED',
    verificationDate: '2026-02-15',
    yearsInBusiness: 14,
    isoCertifications: ['ISO 9001', 'ISO 14001', 'CE', 'RoHS'],
    rating: 4.9,
    internalScore: 96,
    capabilities: {
      oem: true,
      odm: true,
      privateLabel: true,
      customPackaging: true,
      customBranding: true,
      smallBatch: true,
      massProduction: true
    },
    businessLicenseNo: 'MA91440300MA5EX771',
    notes: 'Gold supplier with ISO9001 certification. Excellent track record for Africa export models with dual SIM 4G.',
    createdAt: '2025-11-10',
    updatedAt: '2026-08-20'
  },
  {
    id: 'mfg-102',
    companyName: 'Guangzhou Yuexiu Footwear & Leather Co., Ltd.',
    companyNameChinese: '广州越秀鞋业皮革有限公司',
    manufacturerType: 'Factory',
    province: 'Guangdong',
    city: 'Guangzhou',
    address: 'No. 88 Baiyun Footwear Industrial Zone, Yuexiu, Guangzhou',
    supplierUrls: ['https://1688.com/factory/yuexiushoes'],
    contactPerson: 'Li Na (Export Manager)',
    contactEmail: 'sales@yuexiushoes.cn',
    contactPhone: '+86 20 8654 9912',
    categories: ['Fashion & Footwear', 'Apparel & Textiles'],
    specializations: ['Men Sneakers', 'Casual Shoes', 'Leather Loafers', 'Custom Logo Footwear'],
    factorySize: '18,000 sqm',
    productionCapacity: '200,000 pairs/month',
    minimumOrderQuantity: 200,
    averageLeadTimeDays: 18,
    verificationStatus: 'VERIFIED',
    verificationDate: '2026-01-10',
    yearsInBusiness: 12,
    isoCertifications: ['ISO 9001', 'SGS Audited', 'BSCI'],
    rating: 4.7,
    internalScore: 92,
    capabilities: {
      oem: true,
      odm: true,
      privateLabel: true,
      customPackaging: true,
      customBranding: true,
      smallBatch: false,
      massProduction: true
    },
    businessLicenseNo: 'MA91440101MA58911X',
    notes: 'Top footwear manufacturer in Guangzhou. High export volume to Nigeria (Onitsha & Aba markets).',
    createdAt: '2025-12-01',
    updatedAt: '2026-08-15'
  },
  {
    id: 'mfg-103',
    companyName: 'Yiwu Smart Packaging & Machinery Equipment Co., Ltd.',
    companyNameChinese: '义乌市智能包装机械设备有限公司',
    manufacturerType: 'Factory',
    province: 'Zhejiang',
    city: 'Yiwu',
    address: 'Choujiang Industrial Park, Yiwu, Jinhua, Zhejiang',
    supplierUrls: ['https://1688.com/factory/yiwupackagingmachinery'],
    contactPerson: 'Wang Qiang (Technical Sales Director)',
    contactEmail: 'wang.q@yiwupackmachinery.cn',
    contactPhone: '+86 579 8511 2009',
    categories: ['Machinery & Equipment', 'Industrial & Packaging'],
    specializations: ['Liquid Filling Machines', 'Continuous Band Sealers', 'Shrink Wrap Machines', 'Pouch Packers'],
    factorySize: '12,000 sqm',
    productionCapacity: '1,500 machines/month',
    minimumOrderQuantity: 1,
    averageLeadTimeDays: 15,
    verificationStatus: 'PREMIUM_VERIFIED',
    verificationDate: '2026-03-01',
    yearsInBusiness: 16,
    isoCertifications: ['ISO 9001', 'CE Certified', 'TÜV Rheinland'],
    rating: 4.8,
    internalScore: 94,
    capabilities: {
      oem: true,
      odm: true,
      privateLabel: true,
      customPackaging: false,
      customBranding: true,
      smallBatch: true,
      massProduction: true
    },
    businessLicenseNo: 'MA91330782MA29881A',
    notes: 'Specializes in easy-maintenance food & beverage packaging machinery popular among Nigerian SMEs.',
    createdAt: '2026-01-05',
    updatedAt: '2026-08-28'
  },
  {
    id: 'mfg-104',
    companyName: 'Foshan Green Solar Power Systems Co., Ltd.',
    companyNameChinese: '佛山市绿能太阳能电力系统有限公司',
    manufacturerType: 'Factory',
    province: 'Guangdong',
    city: 'Foshan',
    address: 'Nanhai High-Tech Zone, Foshan, Guangdong',
    supplierUrls: ['https://1688.com/factory/foshangreensolar'],
    contactPerson: 'Zhang Min',
    contactEmail: 'info@foshangreensolar.cn',
    contactPhone: '+86 757 8233 4001',
    categories: ['Renewable Energy', 'Electrical & Solar'],
    specializations: ['Solar Inverters', 'LiFePO4 Lithium Batteries', 'Mono Solar Panels', 'Portable Power Stations'],
    factorySize: '35,000 sqm',
    productionCapacity: '80,000 units/month',
    minimumOrderQuantity: 10,
    averageLeadTimeDays: 14,
    verificationStatus: 'VERIFIED',
    verificationDate: '2026-04-12',
    yearsInBusiness: 9,
    isoCertifications: ['ISO 9001', 'ISO 14001', 'TÜV Rheinland'],
    rating: 4.8,
    internalScore: 93,
    capabilities: {
      oem: true,
      odm: true,
      privateLabel: true,
      customPackaging: true,
      customBranding: true,
      smallBatch: true,
      massProduction: true
    },
    notes: 'Grade-A cell supplier. All inverters tested under tropical temperature conditions.',
    createdAt: '2026-02-01',
    updatedAt: '2026-09-01'
  },
  {
    id: 'mfg-105',
    companyName: 'Dongguan Precision Beauty & Medical Care Co., Ltd.',
    companyNameChinese: '东莞市精密美容医疗科技发展有限公司',
    manufacturerType: 'Factory',
    province: 'Guangdong',
    city: 'Dongguan',
    address: 'Songshan Lake Innovation Park, Dongguan',
    supplierUrls: ['https://1688.com/factory/dgprecisionbeauty'],
    contactPerson: 'Lin Xiaoyu',
    contactEmail: 'sales@dgprecisionbeauty.cn',
    contactPhone: '+86 769 8322 1099',
    categories: ['Beauty & Health', 'Personal Care'],
    specializations: ['Laser Hair Removal Devices', 'Hydra Facial Machines', 'Ultrasonic Skin Scrubbers', 'Massage Guns'],
    factorySize: '10,000 sqm',
    productionCapacity: '40,000 units/month',
    minimumOrderQuantity: 20,
    averageLeadTimeDays: 10,
    verificationStatus: 'UNDER_REVIEW',
    yearsInBusiness: 6,
    isoCertifications: ['ISO 13485', 'CE Certified'],
    rating: 4.5,
    internalScore: 82,
    capabilities: {
      oem: true,
      odm: true,
      privateLabel: true,
      customPackaging: true,
      customBranding: true,
      smallBatch: true,
      massProduction: true
    },
    notes: 'Under review for new CE/FDA Africa export documentation.',
    createdAt: '2026-05-10',
    updatedAt: '2026-09-02'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    manufacturerId: 'mfg-101',
    manufacturerName: 'Shenzhen Security Vision Technology Co., Ltd.',
    manufacturerVerified: true,
    productName: '4G Solar Powered Outdoor CCTV Camera with Dual Lens & Night Vision',
    productNameChinese: '4G 太阳能双镜头监控摄像头',
    category: 'Security & Surveillance',
    subcategory: 'CCTV Cameras',
    description: '100% Wire-free 4G LTE solar security camera with PIR motion detection, color night vision, 8W solar panel, dual-way audio, and 355-degree PTZ rotation. Compatible with MTN, Airtel, Glo 4G networks.',
    specifications: {
      'Resolution': '4MP / 1440P Ultra HD',
      'Connectivity': '4G LTE SIM Card Slot + WiFi',
      'Solar Panel': '8W Monocrystalline',
      'Battery': '15,600mAh Rechargeable Lithium',
      'Night Vision': 'Color Night Vision (6 IR LEDs + 6 Spotlights)',
      'Storage': 'MicroSD up to 128GB + Cloud Storage',
      'Waterproof Rating': 'IP66 Weatherproof'
    },
    modelNumber: 'SV-SL4G-4MP',
    sku: 'SEC-SOLAR-4G-4MP',
    moq: 50,
    unit: 'units',
    supplierPriceCny: 165, // ~ ₦35,475
    priceRangeCny: '¥155 - ¥180',
    priceLastUpdated: '2026-08-30',
    productionLeadTimeDays: 12,
    productImages: [
      'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=800&auto=format&fit=crop&q=80'
    ],
    supplierUrl: 'https://1688.com/item/szsecurityvision/4g-solar-cctv-4mp',
    verificationStatus: 'PREMIUM_VERIFIED',
    availabilityStatus: 'IN_STOCK',
    aiSearchTags: ['solar cctv', '4g camera', 'outdoor surveillance', 'wireless camera', 'motion detection camera', 'security camera lagos'],
    weightKg: 1.8,
    cbm: 0.006,
    variants: [
      { id: 'v-001-a', name: '4MP Standard (No SD Card)', sku: 'SEC-SOLAR-4G-4MP-NOSD', priceCny: 165, moq: 50, specifications: { Storage: 'None' } },
      { id: 'v-001-b', name: '4MP + 64GB High Speed SD Card', sku: 'SEC-SOLAR-4G-4MP-64G', priceCny: 185, moq: 50, specifications: { Storage: '64GB Kingston SD' } },
      { id: 'v-001-c', name: '8MP 4K Dual Panel Deluxe', sku: 'SEC-SOLAR-4G-8MP-128G', priceCny: 220, moq: 30, specifications: { Storage: '128GB SD', Resolution: '8MP 4K' } }
    ],
    createdAt: '2026-01-10',
    updatedAt: '2026-08-30'
  },
  {
    id: 'prod-002',
    manufacturerId: 'mfg-102',
    manufacturerName: 'Guangzhou Yuexiu Footwear & Leather Co., Ltd.',
    manufacturerVerified: true,
    productName: 'Men Breathable Cushioned Running Sneakers (Wholesale)',
    productNameChinese: '男士透气网面减震运动鞋',
    category: 'Fashion & Footwear',
    subcategory: 'Sneakers',
    description: 'Lightweight air-cushioned sports sneakers featuring anti-slip TPU outsole and breathable mesh upper. Ideal for retail markets in Lagos, Abuja, and Port Harcourt.',
    specifications: {
      'Upper Material': 'Flyknit Mesh',
      'Sole Material': 'MD + Rubber TPU Cushion',
      'Sizes Available': 'EU 39 - 45',
      'Colors': 'Black/Red, White/Emerald, All Black, Grey/Blue',
      'Packaging': 'Individual Brand Box or Bulk Polybag'
    },
    modelNumber: 'YX-SNEAK-2026',
    sku: 'FSH-MN-SNK-2026',
    moq: 200,
    unit: 'pairs',
    supplierPriceCny: 42, // ~ ₦9,030
    priceRangeCny: '¥38 - ¥45',
    priceLastUpdated: '2026-08-25',
    productionLeadTimeDays: 18,
    productImages: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80'
    ],
    supplierUrl: 'https://1688.com/item/yuexiushoes/breathable-sneakers-2026',
    verificationStatus: 'VERIFIED',
    availabilityStatus: 'MADE_TO_ORDER',
    aiSearchTags: ['mens sneakers', 'running shoes', 'fashion footwear', 'sports shoes', 'wholesale shoes nigeria', 'sneakers 500 pairs'],
    weightKg: 0.75,
    cbm: 0.004,
    createdAt: '2026-02-14',
    updatedAt: '2026-08-25'
  },
  {
    id: 'prod-003',
    manufacturerId: 'mfg-103',
    manufacturerName: 'Yiwu Smart Packaging & Machinery Equipment Co., Ltd.',
    manufacturerVerified: true,
    productName: 'Automatic Tabletop Liquid Bottle Filling Machine (10-1000ml)',
    productNameChinese: '全自动台式液体灌装机',
    category: 'Machinery & Equipment',
    subcategory: 'Packaging Machinery',
    description: 'Digital control pneumatic liquid filling machine for water, juice, cosmetics, oil, and liquid soap. High accuracy peristaltic pump with stainless steel 304 food-grade body.',
    specifications: {
      'Filling Volume': '10ml - 1000ml (Adjustable)',
      'Filling Speed': '20 - 50 bottles/min',
      'Filling Accuracy': '± 0.5%',
      'Power Supply': '220V 50Hz (Nigeria Standard)',
      'Air Pressure': '0.4 - 0.6 MPa',
      'Material': 'Stainless Steel SUS304'
    },
    modelNumber: 'YW-LFM-1000S',
    sku: 'MCH-LIQ-FILL-1000',
    moq: 1,
    unit: 'units',
    supplierPriceCny: 1850, // ~ ₦397,750
    priceRangeCny: '¥1,750 - ¥1,950',
    priceLastUpdated: '2026-09-01',
    productionLeadTimeDays: 10,
    productImages: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80'
    ],
    supplierUrl: 'https://1688.com/item/yiwupackaging/liquid-filling-machine-1000',
    verificationStatus: 'PREMIUM_VERIFIED',
    availabilityStatus: 'IN_STOCK',
    aiSearchTags: ['liquid filling machine', 'bottle filler', 'automatic filling', 'juice packaging machine', 'water bottling machine', 'cosmetic filler'],
    weightKg: 32.0,
    cbm: 0.18,
    createdAt: '2026-03-05',
    updatedAt: '2026-09-01'
  },
  {
    id: 'prod-004',
    manufacturerId: 'mfg-104',
    manufacturerName: 'Foshan Green Solar Power Systems Co., Ltd.',
    manufacturerVerified: true,
    productName: 'Hybrid Pure Sine Wave Solar Inverter 5.5KW / 48V with MPPT Charge Controller',
    productNameChinese: '5.5KW 48V 混合纯正弦波太阳能逆变器',
    category: 'Renewable Energy',
    subcategory: 'Solar Inverters',
    description: 'Commercial grade 5.5KW hybrid solar inverter with built-in 100A MPPT controller, LCD touch display, mobile app WiFi monitoring, and parallel capability up to 9 units.',
    specifications: {
      'Rated Power': '5,500W / 5.5KVA',
      'System Voltage': '48V DC',
      'Output Voltage': '230V AC ± 5% (Pure Sine Wave)',
      'MPPT Solar Input': '120V - 450V DC (Max 5,500W Solar Panel Array)',
      'Max Charge Current': '100A MPPT',
      'WiFi Monitoring': 'Built-in Mobile App Monitoring'
    },
    modelNumber: 'FS-INV-5.5KW-H',
    sku: 'SOL-INV-5.5KVA-48V',
    moq: 10,
    unit: 'units',
    supplierPriceCny: 1200, // ~ ₦258,000
    priceRangeCny: '¥1,150 - ¥1,280',
    priceLastUpdated: '2026-09-02',
    productionLeadTimeDays: 14,
    productImages: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=800&auto=format&fit=crop&q=80'
    ],
    supplierUrl: 'https://1688.com/item/foshangreensolar/hybrid-inverter-5k5',
    verificationStatus: 'VERIFIED',
    availabilityStatus: 'IN_STOCK',
    aiSearchTags: ['solar inverter 5.5kw', 'hybrid inverter', 'pure sine wave inverter', '48v solar inverter', 'mppt charge controller', 'solar power nigeria'],
    weightKg: 11.5,
    cbm: 0.035,
    createdAt: '2026-02-20',
    updatedAt: '2026-09-02'
  }
];

export const INITIAL_BUYER_REQUESTS: BuyerRequest[] = [
  {
    id: 'req-901',
    customerName: 'Emeka Chukwuma (Emmatech Wholesale)',
    customerEmail: 'emeka.chukwuma@emmatech.ng',
    title: '200 Units 4G Solar CCTV Cameras for Business Stores in Lagos & Abuja',
    description: 'I need 200 units of solar powered outdoor CCTV cameras. Must be 4G SIM compatible (MTN/Airtel), night vision, motion detection, and come with solar panels included.',
    category: 'Security & Surveillance',
    quantity: 200,
    targetBudgetNgn: 7000000,
    destinationCity: 'Lagos',
    shippingPreference: 'SEA_FREIGHT',
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&auto=format&fit=crop&q=80',
        name: 'sample_camera_spec.jpg'
      }
    ],
    status: 'QUOTE_READY',
    createdAt: '2026-09-02T10:15:00Z'
  },
  {
    id: 'req-902',
    customerName: 'Hajiya Fatima Bello (Bello Fashion Hub)',
    customerEmail: 'fatima@bellofashion.ng',
    title: '500 Pairs of Men Breathable Sneakers with Custom Logo',
    description: 'Looking to purchase 500 pairs of high quality breathable running sneakers in assorted sizes (EU 40 - 45). Prefer black and white colorways.',
    category: 'Fashion & Footwear',
    quantity: 500,
    targetBudgetNgn: 5500000,
    destinationCity: 'Kano',
    shippingPreference: 'SEA_FREIGHT',
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
        name: 'sneaker_sample.jpg'
      }
    ],
    status: 'AI_SOURCING',
    createdAt: '2026-09-04T14:30:00Z'
  },
  {
    id: 'req-903',
    customerName: 'Dr. Adebayo Olanrewaju (FreshBottles Ltd)',
    customerEmail: 'adebayo@freshbottles.ng',
    title: '2 Units Tabletop Liquid Filling Machines for Juice & Water Production',
    description: 'We need 2 stainless steel liquid filling machines for our beverage bottling plant in Ibadan. Volume range 10-1000ml.',
    category: 'Machinery & Equipment',
    quantity: 2,
    targetBudgetNgn: 1200000,
    destinationCity: 'Ibadan',
    shippingPreference: 'AIR_CARGO',
    media: [],
    status: 'ORDER_PLACED',
    createdAt: '2026-08-28T09:00:00Z'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-2026-9042',
    quoteId: 'q-881',
    buyerRequestId: 'req-903',
    customerName: 'Dr. Adebayo Olanrewaju (FreshBottles Ltd)',
    customerEmail: 'adebayo@freshbottles.ng',
    customerPhone: '+234 803 441 9901',
    productName: 'Automatic Tabletop Liquid Bottle Filling Machine (10-1000ml)',
    productImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    manufacturerName: 'Yiwu Smart Packaging & Machinery Equipment Co., Ltd.',
    quantity: 2,
    totalAmountNgn: 1180000,
    shippingMode: 'AIR_CARGO',
    destinationAddress: 'Plot 12 Commercial Layout, Challenge, Ibadan, Oyo State',
    status: 'DEPARTED_CHINA',
    trackingNumber: 'SN-NGA-882910',
    procurementOrderId: 'PO-2026-00184',
    chinaWarehouseReceiptId: 'WH-CAN-9910',
    shipmentId: 'SHP-2026-7731',
    createdAt: '2026-08-29T11:20:00Z',
    updatedAt: '2026-09-04T16:00:00Z'
  }
];

export const INITIAL_WAREHOUSE_INSPECTION: WarehouseInspection = {
  id: 'WH-CAN-9910',
  procurementOrderId: 'PO-2026-00184',
  orderId: 'ORD-2026-9042',
  warehouseLocation: 'Guangzhou Baiyun Logistics Hub A4, Guangdong',
  receivedQuantity: 2,
  inspectedQuantity: 2,
  defectCount: 0,
  result: 'PASSED',
  inspectionPhotos: [
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80'
  ],
  inspectorNotes: 'Both units inspected and powered on. SUS304 steel body verified without scratches. Pneumatic valves pre-calibrated. Packed in heavy wooden export crates.',
  inspectedAt: '2026-09-02T14:00:00Z'
};

export const INITIAL_SHIPMENT: Shipment = {
  id: 'SHP-2026-7731',
  orderId: 'ORD-2026-9042',
  carrier: 'Tradiixx Air Express Hub',
  shippingMode: 'AIR_CARGO',
  origin: 'Guangzhou Baiyun Airport (CAN)',
  destination: 'Murtala Muhammed International Airport (LOS)',
  weightKg: 64.0,
  cbm: 0.36,
  billOfLading: 'AWB-771-9021882',
  departureDate: '2026-09-04T08:00:00Z',
  estimatedArrivalDate: '2026-09-08T18:00:00Z',
  trackingEvents: [
    {
      id: 'evt-1',
      timestamp: '2026-08-29T11:20:00Z',
      status: 'PAID',
      title: 'Payment Confirmed & Order Activated',
      location: 'Lagos, Nigeria',
      description: 'Customer payment of ₦1,180,000 received via Paystack. Order activated.'
    },
    {
      id: 'evt-2',
      timestamp: '2026-08-30T09:00:00Z',
      status: 'PROCUREMENT_STARTED',
      title: 'Procurement Order Dispatched',
      location: 'Yiwu, China',
      description: 'PO-2026-00184 issued to Yiwu Smart Packaging Machinery. Production initiated.'
    },
    {
      id: 'evt-3',
      timestamp: '2026-09-02T11:00:00Z',
      status: 'ARRIVED_CHINA_WAREHOUSE',
      title: 'Received at Guangzhou Warehouse',
      location: 'Guangzhou, China',
      description: 'Package delivered by supplier to Tradiixx Guangzhou Logistics Hub.'
    },
    {
      id: 'evt-4',
      timestamp: '2026-09-02T14:00:00Z',
      status: 'QC_INSPECTION_PASSED',
      title: 'Quality Control Inspection Passed',
      location: 'Guangzhou Warehouse',
      description: 'Physical inspection completed. SUS304 specification, voltage, and components verified 100% OK.'
    },
    {
      id: 'evt-5',
      timestamp: '2026-09-04T08:00:00Z',
      status: 'DEPARTED_CHINA',
      title: 'Departed Guangzhou Airport',
      location: 'Guangzhou Airport (CAN)',
      description: 'Cargo loaded on Air Cargo Flight ET3812 bound for Lagos.'
    }
  ]
};

export const INITIAL_LEDGER: LedgerEntry[] = [
  {
    id: 'led-101',
    orderId: 'ORD-2026-9042',
    type: 'PAYMENT_RECEIVED',
    amountNgn: 1180000,
    description: 'Customer Payment - Dr. Adebayo Olanrewaju',
    reference: 'PAYSTACK-REF-9028112',
    createdAt: '2026-08-29T11:20:00Z'
  },
  {
    id: 'led-102',
    orderId: 'ORD-2026-9042',
    type: 'PROCUREMENT_PAID',
    amountNgn: 795500, // 3,700 CNY @ 215 NGN
    description: 'Supplier Invoice Payment - Yiwu Smart Packaging',
    reference: 'BANK-TRANSFER-CNY-901',
    createdAt: '2026-08-30T10:00:00Z'
  }
];
