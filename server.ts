import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

import {
  INITIAL_AI_SETTINGS,
  INITIAL_MANUFACTURERS,
  INITIAL_PRODUCTS,
  INITIAL_BUYER_REQUESTS,
  INITIAL_ORDERS,
  INITIAL_SHIPMENT,
  INITIAL_WAREHOUSE_INSPECTION,
  INITIAL_LEDGER
} from "./src/data/initialData";

import {
  Manufacturer,
  Product,
  BuyerRequest,
  Order,
  AISettingConfig,
  LedgerEntry,
  AISourcingReport,
  LandedCostBreakdown,
  Shipment,
  WarehouseInspection
} from "./src/types";

dotenv.config();

const PORT = 3000;

// Initialize server-side Gemini client securely
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not defined. Using fallback heuristic logic.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "placeholder_key",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// In-Memory Database for applet lifecycle
let dbSettings: AISettingConfig = { ...INITIAL_AI_SETTINGS };
let dbManufacturers: Manufacturer[] = [...INITIAL_MANUFACTURERS];
let dbProducts: Product[] = [...INITIAL_PRODUCTS];
let dbRequests: BuyerRequest[] = [...INITIAL_BUYER_REQUESTS];
let dbOrders: Order[] = [...INITIAL_ORDERS];
let dbShipments: Record<string, Shipment> = {
  'ORD-2026-9042': { ...INITIAL_SHIPMENT }
};
let dbInspections: Record<string, WarehouseInspection> = {
  'ORD-2026-9042': { ...INITIAL_WAREHOUSE_INSPECTION }
};
let dbLedger: LedgerEntry[] = [...INITIAL_LEDGER];
let dbSourcingReports: Record<string, AISourcingReport> = {};

// Helper: Landed Cost Engine
function calculateLandedCost(
  productPriceCny: number,
  quantity: number,
  weightKgEst: number,
  cbmEst: number,
  shippingMode: 'AIR_EXPRESS' | 'AIR_CARGO' | 'SEA_FREIGHT',
  settings: AISettingConfig
): LandedCostBreakdown {
  const exchangeRate = settings.cnyNgnExchangeRate;
  const productCostCny = productPriceCny * quantity;
  const productCostNgn = Math.round(productCostCny * exchangeRate);

  // Procurement fee (approx 3% of product cost)
  const procurementFeeNgn = Math.max(15000, Math.round(productCostNgn * 0.03));

  // China Warehouse Handling & QC Inspection
  const chinaWarehouseFeeNgn = Math.round(Math.max(10000, quantity * 250));

  // International Shipping Freight Rates to Nigeria (Lagos Hub)
  // AIR_EXPRESS: ~ ₦11,500/kg
  // AIR_CARGO: ~ ₦8,200/kg
  // SEA_FREIGHT: ~ ₦380,000/CBM or ₦1,200/kg
  let freightRateNgn = 0;
  const totalWeight = weightKgEst * quantity;
  const totalCbm = cbmEst * quantity;

  if (shippingMode === 'AIR_EXPRESS') {
    freightRateNgn = Math.round(Math.max(25000, totalWeight * 11500));
  } else if (shippingMode === 'AIR_CARGO') {
    freightRateNgn = Math.round(Math.max(35000, totalWeight * 8200));
  } else {
    // SEA FREIGHT
    const cbmCharge = totalCbm * 380000;
    const weightCharge = totalWeight * 1400;
    freightRateNgn = Math.round(Math.max(45000, Math.max(cbmCharge, weightCharge)));
  }

  // Estimated Customs Duties & Port Clearance (approx 12%-18% depending on product)
  const estimatedCustomsNgn = Math.round(productCostNgn * 0.14);

  // Local Nigeria Delivery (Lagos / Abuja / Kano / Port Harcourt)
  const localDeliveryNgn = Math.min(85000, Math.max(12000, Math.round(quantity * 400)));

  // Platform Margin (e.g. 5.5%)
  const subtotalBeforeMargin = productCostNgn + procurementFeeNgn + chinaWarehouseFeeNgn + freightRateNgn + estimatedCustomsNgn + localDeliveryNgn;
  const platformServiceFeeNgn = Math.round(subtotalBeforeMargin * (settings.platformMarginPercent / 100));

  const totalLandedCostNgn = subtotalBeforeMargin + platformServiceFeeNgn;

  return {
    productCostCny,
    productCostNgn,
    procurementFeeNgn,
    chinaWarehouseFeeNgn,
    internationalShippingNgn: freightRateNgn,
    estimatedCustomsNgn,
    localDeliveryNgn,
    platformServiceFeeNgn,
    totalLandedCostNgn,
    exchangeRateNgnCny: exchangeRate,
    weightKgEst: totalWeight,
    cbmEst: totalCbm,
    shippingMode
  };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "50mb" }));

  // API ROUTES FIRST

  // 1. AI Request Analyzer (Multimodal)
  app.post("/api/ai/analyze-request", async (req, res) => {
    try {
      const { description, imageBase64, productUrl } = req.body;

      if (!description && !imageBase64 && !productUrl) {
        return res.status(400).json({ error: "Please provide a description, image, or product URL." });
      }

      let aiResult = {
        title: description ? description.slice(0, 60) : "Sourcing Request",
        category: "General Hardware",
        quantity: 100,
        connectivity: "Standard",
        extractedSpecs: {},
        suggestedKeywords: ["china import", "wholesale"]
      };

      if (process.env.GEMINI_API_KEY) {
        try {
          const ai = getAiClient();
          const parts: any[] = [];

          if (imageBase64) {
            const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
            parts.push({
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Data
              }
            });
          }

          const promptText = `
You are an expert AI China Sourcing & Procurement Agent for Nigerian importers.
Analyze the following buyer input:
- Text Description: "${description || 'None'}"
- Product URL: "${productUrl || 'None'}"

Extract structured technical information for finding Chinese manufacturers on 1688/Alibaba.
Respond in valid JSON format with the following keys:
{
  "title": "Short catchy product title (e.g. 4G Solar CCTV Camera)",
  "category": "One of: Security & Surveillance, Fashion & Footwear, Machinery & Equipment, Renewable Energy, Beauty & Health, Electronics, Auto Parts",
  "quantity": estimated number from text or default 100,
  "extractedSpecs": { "key": "value" },
  "connectivity": "e.g. 4G LTE, WiFi, Pneumatic, Manual, Hybrid",
  "suggestedKeywords": ["keyword1", "keyword2", "keyword3"]
}
`;
          parts.push({ text: promptText });

          const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: { parts },
            config: {
              responseMimeType: "application/json"
            }
          });

          if (response.text) {
            aiResult = JSON.parse(response.text.trim());
          }
        } catch (genError) {
          console.warn("Gemini API call error in analyze-request, falling back to local analysis:", genError);
        }
      }

      return res.json({ success: true, analysis: aiResult });
    } catch (err: any) {
      console.error("Error in /api/ai/analyze-request:", err);
      return res.status(500).json({ error: err.message || "Failed to analyze request" });
    }
  });

  // 2. AI Product Matching Engine
  app.post("/api/ai/match-sourcing", async (req, res) => {
    try {
      const { requestId, title, description, category, quantity, destinationCity, shippingPreference } = req.body;

      const qty = quantity || 100;
      const shipPref = shippingPreference || 'SEA_FREIGHT';

      // Find matching products in database
      const filteredProducts = dbProducts.filter(p => {
        if (!category || category === 'All') return true;
        return p.category.toLowerCase().includes(category.toLowerCase()) || category.toLowerCase().includes(p.category.toLowerCase());
      });

      const candidates = filteredProducts.length > 0 ? filteredProducts : dbProducts;

      // Score candidates based on AI settings weights
      const scoredCandidates = candidates.map(prod => {
        const mfg = dbManufacturers.find(m => m.id === prod.manufacturerId) || dbManufacturers[0];
        
        let specScore = 85;
        const textToMatch = `${title} ${description}`.toLowerCase();
        const prodName = prod.productName.toLowerCase();
        
        prod.aiSearchTags.forEach(tag => {
          if (textToMatch.includes(tag.toLowerCase())) specScore += 4;
        });
        if (prodName.includes(title.toLowerCase() || '')) specScore += 10;
        specScore = Math.min(99, specScore);

        const moqScore = qty >= prod.moq ? 100 : Math.round((qty / prod.moq) * 80);
        const verifScore = mfg.verificationStatus === 'PREMIUM_VERIFIED' ? 100 : (mfg.verificationStatus === 'VERIFIED' ? 88 : 70);
        const relScore = mfg.internalScore || 90;
        const leadScore = prod.productionLeadTimeDays <= 15 ? 95 : 85;
        const priceScore = 90;

        const wSpec = dbSettings.weightSpecificationMatch / 100;
        const wRel = dbSettings.weightManufacturerReliability / 100;
        const wPrice = dbSettings.weightPriceSuitability / 100;
        const wMoq = dbSettings.weightMoqCompatibility / 100;
        const wLead = dbSettings.weightLeadTime / 100;
        const wVerif = dbSettings.weightVerificationStatus / 100;

        const totalScore = Math.round(
          specScore * wSpec +
          relScore * wRel +
          priceScore * wPrice +
          moqScore * wMoq +
          leadScore * wLead +
          verifScore * wVerif
        );

        return {
          product: prod,
          manufacturer: mfg,
          matchScore: totalScore,
          compatibilityBreakdown: {
            specifications: specScore,
            moq: moqScore,
            price: priceScore,
            verification: verifScore,
            leadTime: leadScore
          }
        };
      });

      // Sort descending by match score
      scoredCandidates.sort((a, b) => b.matchScore - a.matchScore);

      const best = scoredCandidates[0] || {
        product: dbProducts[0],
        manufacturer: dbManufacturers[0],
        matchScore: 94,
        compatibilityBreakdown: { specifications: 95, moq: 100, price: 92, verification: 98, leadTime: 90 }
      };

      const landedCost = calculateLandedCost(
        best.product.supplierPriceCny,
        qty,
        best.product.weightKg || 1.0,
        best.product.cbm || 0.005,
        shipPref,
        dbSettings
      );

      // Construct alternatives
      const alternatives = [
        {
          label: "Best Quality Match",
          match: {
            product: best.product,
            manufacturer: best.manufacturer,
            matchScore: best.matchScore,
            compatibilityBreakdown: best.compatibilityBreakdown,
            whyRecommended: [
              `Verified Manufacturer (${best.manufacturer.companyName}) with ISO certification`,
              `MOQ compatibility: Requested ${qty} units matches supplier MOQ of ${best.product.moq}`,
              `Proven track record for West African port logistics`
            ]
          },
          landedCostNgn: landedCost.totalLandedCostNgn
        }
      ];

      if (scoredCandidates.length > 1) {
        const alt2 = scoredCandidates[1];
        const alt2Landed = calculateLandedCost(
          alt2.product.supplierPriceCny,
          qty,
          alt2.product.weightKg || 1.0,
          alt2.product.cbm || 0.005,
          shipPref,
          dbSettings
        );
        alternatives.push({
          label: "Best Value Option",
          match: {
            product: alt2.product,
            manufacturer: alt2.manufacturer,
            matchScore: alt2.matchScore,
            compatibilityBreakdown: alt2.compatibilityBreakdown,
            whyRecommended: [
              `Competitive pricing at ¥${alt2.product.supplierPriceCny}/unit`,
              `Shorter lead time (${alt2.product.productionLeadTimeDays} days)`
            ]
          },
          landedCostNgn: alt2Landed.totalLandedCostNgn
        });
      }

      let explanation = `Our AI Sourcing Agent identified ${best.product.productName} from ${best.manufacturer.companyName} (${best.manufacturer.city}, China) as the top match (${best.matchScore}% confidence score). The total estimated NGN landed cost for ${qty} units delivered to ${destinationCity || 'Lagos'} is ₦${landedCost.totalLandedCostNgn.toLocaleString()}, covering direct product procurement, China warehouse inspection, ${shipPref.replace('_', ' ')} freight, customs duties, local courier, and SinoNaija service fees.`;

      const requiresApproval = landedCost.totalLandedCostNgn > dbSettings.autoApprovalThresholdNgn;

      const report: AISourcingReport = {
        id: `rep-${Date.now()}`,
        buyerRequestId: requestId || 'req-new',
        confidenceScore: best.matchScore,
        bestMatch: {
          product: best.product,
          manufacturer: best.manufacturer,
          matchScore: best.matchScore,
          compatibilityBreakdown: best.compatibilityBreakdown,
          whyRecommended: [
            `Verified Chinese Manufacturer in ${best.manufacturer.city}, ${best.manufacturer.province}`,
            `Matches specifications requested with dual network SIM support`,
            `Factory production capacity of ${best.manufacturer.productionCapacity}`
          ]
        },
        alternatives,
        suggestedLandedCost: landedCost,
        aiExplanation: explanation,
        requiresHumanApproval: requiresApproval,
        createdAt: new Date().toISOString()
      };

      if (requestId) {
        dbSourcingReports[requestId] = report;
        const reqObj = dbRequests.find(r => r.id === requestId);
        if (reqObj) {
          reqObj.status = 'QUOTE_READY';
          reqObj.aiSourcingResultId = report.id;
        }
      }

      return res.json({ success: true, report });
    } catch (err: any) {
      console.error("Error in /api/ai/match-sourcing:", err);
      return res.status(500).json({ error: err.message || "Failed to perform AI sourcing match" });
    }
  });

  // 3. AI Product Data Enrichment for Merchandizers
  app.post("/api/ai/enrich-product", async (req, res) => {
    try {
      const { productName, description, rawSpecs } = req.body;
      let enriched = {
        productNameChinese: "精选高品质产品",
        category: "General Hardware",
        subcategory: "Miscellaneous",
        aiSearchTags: ["china wholesale", "verified supplier"],
        summary: "High quality export standard product manufactured for African and global trade."
      };

      if (process.env.GEMINI_API_KEY) {
        try {
          const ai = getAiClient();
          const prompt = `
You are an expert Chinese Merchandizer for an import-export trading platform.
Enrich the following product profile:
Name: "${productName}"
Description: "${description}"
Specs: ${JSON.stringify(rawSpecs || {})}

Return JSON:
{
  "productNameChinese": "accurate Chinese name string",
  "category": "e.g. Security & Surveillance, Fashion & Footwear, Machinery & Equipment, Renewable Energy, Beauty & Health, Electronics, Auto Parts",
  "subcategory": "specific subcategory",
  "aiSearchTags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "summary": "1-2 sentence professional merchandising summary"
}
`;
          const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: prompt,
            config: { responseMimeType: "application/json" }
          });
          if (response.text) {
            enriched = JSON.parse(response.text.trim());
          }
        } catch (e) {
          console.warn("Gemini API call failed for enrich-product:", e);
        }
      }

      return res.json({ success: true, enriched });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || "Enrichment failed" });
    }
  });

  // 4. Paystack Simulator
  app.post("/api/paystack/initialize", (req, res) => {
    const { email, amountNgn, orderId } = req.body;
    const reference = `PS-SINO-${Date.now()}-${Math.floor(Math.random() * 8999 + 1000)}`;
    return res.json({
      status: true,
      message: "Authorization URL created",
      data: {
        authorization_url: `https://checkout.paystack.com/simulate/${reference}`,
        access_code: `ac_${Date.now()}`,
        reference,
        amount: (amountNgn || 0) * 100
      }
    });
  });

  app.post("/api/paystack/verify", (req, res) => {
    const { reference, orderId, amountNgn } = req.body;
    
    // Find order or create order
    let order = dbOrders.find(o => o.id === orderId);
    if (order) {
      order.status = 'PAID';
      order.updatedAt = new Date().toISOString();
    }

    // Ledger entry
    const ledgerEntry: LedgerEntry = {
      id: `led-${Date.now()}`,
      orderId: orderId || 'ORD-NEW',
      type: 'PAYMENT_RECEIVED',
      amountNgn: amountNgn || 0,
      description: `Paystack NGN Payment (${reference})`,
      reference: reference || `REF-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    dbLedger.unshift(ledgerEntry);

    return res.json({
      status: true,
      message: "Payment verified successfully",
      order
    });
  });

  // 5. DATA CRUD ROUTES

  // Manufacturers
  app.get("/api/manufacturers", (req, res) => res.json(dbManufacturers));
  app.post("/api/manufacturers", (req, res) => {
    const newMfg: Manufacturer = {
      ...req.body,
      id: `mfg-${Date.now()}`,
      rating: req.body.rating || 4.5,
      internalScore: req.body.internalScore || 85,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0]
    };
    dbManufacturers.unshift(newMfg);
    res.json({ success: true, manufacturer: newMfg });
  });
  app.put("/api/manufacturers/:id", (req, res) => {
    const index = dbManufacturers.findIndex(m => m.id === req.params.id);
    if (index !== -1) {
      dbManufacturers[index] = { ...dbManufacturers[index], ...req.body, updatedAt: new Date().toISOString().split("T")[0] };
      return res.json({ success: true, manufacturer: dbManufacturers[index] });
    }
    res.status(404).json({ error: "Manufacturer not found" });
  });

  // Products
  app.get("/api/products", (req, res) => res.json(dbProducts));
  app.post("/api/products", (req, res) => {
    const newProd: Product = {
      ...req.body,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0]
    };
    dbProducts.unshift(newProd);
    res.json({ success: true, product: newProd });
  });
  app.post("/api/products/bulk-import", (req, res) => {
    const { products } = req.body;
    if (Array.isArray(products)) {
      const added = products.map((p: any, idx) => ({
        ...p,
        id: `prod-bulk-${Date.now()}-${idx}`,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0]
      }));
      dbProducts = [...added, ...dbProducts];
      return res.json({ success: true, count: added.length });
    }
    res.status(400).json({ error: "Invalid payload format" });
  });

  // Requests
  app.get("/api/requests", (req, res) => res.json(dbRequests));
  app.post("/api/requests", (req, res) => {
    const newReq: BuyerRequest = {
      ...req.body,
      id: `req-${Date.now()}`,
      status: 'PENDING_AI_ANALYSIS',
      createdAt: new Date().toISOString()
    };
    dbRequests.unshift(newReq);
    res.json({ success: true, request: newReq });
  });

  // Orders
  app.get("/api/orders", (req, res) => res.json(dbOrders));
  app.get("/api/orders/:id", (req, res) => {
    const order = dbOrders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    const shipment = dbShipments[order.id];
    const inspection = dbInspections[order.id];
    return res.json({ order, shipment, inspection });
  });
  app.post("/api/orders", (req, res) => {
    const newOrder: Order = {
      ...req.body,
      id: `ORD-2026-${Math.floor(1000 + Math.random() * 8999)}`,
      trackingNumber: `SN-NGA-${Math.floor(100000 + Math.random() * 899999)}`,
      status: 'PAID',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    dbOrders.unshift(newOrder);

    // Initialize shipment & tracking timeline
    const newShipment: Shipment = {
      id: `SHP-2026-${Math.floor(1000 + Math.random() * 8999)}`,
      orderId: newOrder.id,
      carrier: newOrder.shippingMode === 'SEA_FREIGHT' ? 'Maersk SinoNaija Line' : 'SinoNaija Express Air Cargo',
      shippingMode: newOrder.shippingMode,
      origin: 'Guangzhou, China',
      destination: `${newOrder.destinationAddress.split(',')[0] || 'Lagos'}, Nigeria`,
      weightKg: 25.0,
      cbm: 0.1,
      departureDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      estimatedArrivalDate: new Date(Date.now() + 86400000 * 12).toISOString().split('T')[0],
      trackingEvents: [
        {
          id: `evt-${Date.now()}`,
          timestamp: new Date().toISOString(),
          status: 'PAID',
          title: 'Payment Confirmed & Order Activated',
          location: 'Nigeria HQ (Paystack)',
          description: `Full landed cost payment of ₦${newOrder.totalAmountNgn.toLocaleString()} received. Supplier PO initiated.`
        }
      ]
    };
    dbShipments[newOrder.id] = newShipment;

    res.json({ success: true, order: newOrder, trackingNumber: newOrder.trackingNumber });
  });

  app.put("/api/orders/:id/status", (req, res) => {
    const { status, title, location, description, photoUrl } = req.body;
    const order = dbOrders.find(o => o.id === req.params.id);
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();

      const shipment = dbShipments[order.id];
      if (shipment) {
        shipment.trackingEvents.unshift({
          id: `evt-${Date.now()}`,
          timestamp: new Date().toISOString(),
          status,
          title: title || `Status updated to ${status}`,
          location: location || 'Transit Center',
          description: description || `Order transition to ${status}`,
          photoUrl
        });
      }
      return res.json({ success: true, order, shipment });
    }
    res.status(404).json({ error: "Order not found" });
  });

  // Settings
  app.get("/api/settings", (req, res) => res.json(dbSettings));
  app.put("/api/settings", (req, res) => {
    dbSettings = { ...dbSettings, ...req.body };
    res.json({ success: true, settings: dbSettings });
  });

  // Ledger
  app.get("/api/ledger", (req, res) => res.json(dbLedger));

  // VITE MIDDLEWARE FOR DEV / STATIC FOR PROD
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SinoNaija AI Sourcing server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
