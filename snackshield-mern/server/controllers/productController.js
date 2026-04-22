const Product = require('../models/Product');
const Batch = require('../models/Batch');
const Alert = require('../models/Alert');
const blockchainService = require('../services/blockchainService');

// AI Risk Score Calculator
const calculateRiskScore = (product, scans) => {
  let riskScore = 0;
  const reasons = [];

  // Check scan frequency
  if (product.totalScans > 100) {
    riskScore += 20;
    reasons.push('High scan frequency detected');
  }

  // Check suspicious scans ratio
  const suspiciousRatio = product.suspiciousScans / (product.totalScans || 1);
  if (suspiciousRatio > 0.1) {
    riskScore += 30;
    reasons.push('Multiple suspicious scan attempts');
  }

  // Check location inconsistencies
  const uniqueLocations = new Set(product.journeyHistory?.map(j => j.location) || []);
  if (uniqueLocations.size > 5) {
    riskScore += 25;
    reasons.push('Scanned in multiple unexpected locations');
  }

  // Check time-based patterns
  const recentScans = scans?.filter(s => {
    const hourAgo = new Date(Date.now() - 3600000);
    return new Date(s.timestamp) > hourAgo;
  }) || [];
  
  if (recentScans.length > 10) {
    riskScore += 25;
    reasons.push('Rapid scanning pattern detected');
  }

  return {
    score: Math.min(riskScore, 100),
    reasons,
    level: riskScore < 30 ? 'Low' : riskScore < 60 ? 'Medium' : 'High'
  };
};

exports.createProduct = async (req, res) => {
  try {
    const { productName, company, batchId, qrCode, role = 'Manufacturer', location = 'Factory' } = req.body;
    
    const product = await Product.create({ 
      productName, 
      company, 
      batchId, 
      qrCode,
      journeyHistory: [{
        role: 'Manufacturer',
        location: location,
        city: 'Mumbai',
        country: 'India',
        status: 'Verified',
        user: company,
        notes: 'Product created and registered'
      }]
    });

    // ── Blockchain Integration ──
    try {
        const onChainHash = await blockchainService.registerProductOnChain({
            productName,
            company,
            batchId,
            qrCode,
            manufactureDate: product.manufactureDate,
            expiryDate: product.expiryDate
        });
        product.blockchainHash = onChainHash;
        await product.save();
    } catch (bcError) {
        console.warn('⚠️ Blockchain registration deferred:', bcError.message);
    }
    
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyProduct = async (req, res) => {
  try {
    const { qrCode, productId, role = 'Customer', location = 'Unknown', user = 'Anonymous' } = req.body;
    const qrCodeValue = (qrCode || productId || req.body.id || '').trim();

    if (!qrCodeValue) {
      return res.status(400).json({ status: 'Error', message: 'Product ID or QR code is required' });
    }

    const product = await Product.findOne({ qrCode: qrCodeValue });

    if (!product) {
      return res.status(200).json({ status: 'Fake', message: 'No registered record found for this QR code. Possible counterfeit.' });
    }

    // Update scan count
    product.totalScans = (product.totalScans || 0) + 1;

    // Add journey step
    product.journeyHistory = product.journeyHistory || [];
    product.journeyHistory.push({
      role,
      location,
      city: location.split(',')[0]?.trim() || 'Unknown',
      country: location.split(',')[1]?.trim() || 'India',
      status: 'Verified',
      user,
      notes: `Product verified by ${role}`
    });

    // Calculate risk score
    const riskData = calculateRiskScore(product, []);
    product.riskScore = riskData.score;
    product.lastRiskUpdate = new Date();

    // Create alert if high risk
    if (riskData.level === 'High' && riskData.score > 70) {
      Alert.create({
        type: 'High Risk', severity: 'High',
        productId: product.qrCode, productName: product.productName,
        batchId: product.batchId,
        message: `High risk product detected: ${product.productName}`,
        details: riskData.reasons.join(', '),
        company: product.company
      }).catch(() => {});
    }

    await product.save();

    const batch = await Batch.findOne({ batchId: product.batchId });

    // Blockchain calls — fire-and-forget with timeout, never block the response
    const withTimeout = (promise, ms = 3000) =>
      Promise.race([promise, new Promise(resolve => setTimeout(() => resolve(null), ms))]);

    withTimeout(blockchainService.recordScanOnChain(product.qrCode, 'Genuine', location)).catch(() => {});

    return res.json({
      status: 'Genuine',
      productName: product.productName,
      company: product.company,
      batchId: product.batchId,
      manufactureDate: batch?.manufactureDate || product.manufactureDate,
      expiryDate: batch?.expiryDate || product.expiryDate,
      riskScore: product.riskScore,
      riskLevel: riskData.level,
      journeySteps: product.journeyHistory?.length || 0,
      totalScans: product.totalScans,
      blockchainVerified: false,
      trustIndex: 100
    });
  } catch (error) {
    console.error('verifyProduct error:', error.message);
    return res.status(500).json({ status: 'Error', message: 'Verification service error: ' + error.message });
  }
};

// Get product journey
exports.getProductJourney = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // 1. Try searching by individual Unit ID (QR Code)
    let product = await Product.findOne({ qrCode: productId });
    
    // 2. Fallback: Try searching by Batch ID
    if (!product) {
      const batchProduct = await Product.findOne({ batchId: productId }).sort({ createdAt: -1 });
      if (batchProduct) {
        product = batchProduct;
      }
    }
    
    if (!product) {
      return res.status(404).json({ message: 'Traceability record not found for this identifier.' });
    }

    res.json({
      productName: product.productName,
      company: product.company,
      batchId: product.batchId,
      qrCode: product.qrCode,
      journeyHistory: product.journeyHistory || [],
      riskScore: product.riskScore || 0,
      totalScans: product.totalScans || 0
    });
  } catch (error) {
    console.error('Journey Fetch Error:', error);
    res.status(500).json({ message: 'Internal tracking ledger synchronization failed.' });
  }
};

// Get risk score
exports.getRiskScore = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findOne({ qrCode: productId });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const riskData = calculateRiskScore(product, []);

    res.json({
      productId: product.qrCode,
      productName: product.productName,
      riskScore: riskData.score,
      riskLevel: riskData.level,
      reasons: riskData.reasons,
      lastUpdate: product.lastRiskUpdate || new Date(),
      totalScans: product.totalScans || 0,
      suspiciousScans: product.suspiciousScans || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
