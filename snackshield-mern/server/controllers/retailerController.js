const Product = require('../models/Product');
const Scan = require('../models/Scan');
const Alert = require('../models/Alert');
const Batch = require('../models/Batch');

// ─── AI Counterfeit Detection Agent ──────────────────────────────────────────
const runCounterfeitAgent = async (company) => {
  const recentScans = await Scan.find().sort({ scanDate: -1 }).limit(200);
  const products = await Product.find({ company }).limit(100);

  const threats = [];
  const recommendations = [];

  // Detect rapid scanning (> 5 scans of same product in 1 hour)
  const scansByProduct = {};
  const oneHourAgo = new Date(Date.now() - 3600000);
  for (const scan of recentScans) {
    if (new Date(scan.scanDate) > oneHourAgo) {
      scansByProduct[scan.productId] = (scansByProduct[scan.productId] || 0) + 1;
    }
  }
  for (const [productId, count] of Object.entries(scansByProduct)) {
    if (count > 5) {
      threats.push({
        type: 'rapid_scanning',
        productId,
        count,
        message: `Product ${productId} scanned ${count} times in the last hour — possible counterfeit probe.`,
        severity: count > 10 ? 'Critical' : 'High'
      });
    }
  }

  // Detect products with high fake scan ratio
  const fakeRatioProducts = products.filter(p => {
    const ratio = p.suspiciousScans / (p.totalScans || 1);
    return ratio > 0.15 && p.totalScans > 5;
  });
  if (fakeRatioProducts.length > 0) {
    recommendations.push({
      type: 'high_fake_ratio',
      count: fakeRatioProducts.length,
      message: `${fakeRatioProducts.length} product(s) have >15% suspicious scan rate. Consider pulling from shelves.`,
      severity: 'High'
    });
  }

  // Expiry risk detection
  const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const expiringProducts = products.filter(p => p.expiryDate && new Date(p.expiryDate) < sevenDaysFromNow);
  if (expiringProducts.length > 0) {
    recommendations.push({
      type: 'expiry_risk',
      count: expiringProducts.length,
      message: `${expiringProducts.length} product(s) expire within 7 days. Prioritize sales or removal.`,
      severity: 'Medium'
    });
  }

  // Overall store safety score
  const totalFake = recentScans.filter(s => s.result === 'Fake').length;
  const safetyScore = Math.max(0, 100 - (threats.length * 15) - (totalFake * 2) - (fakeRatioProducts.length * 10));

  return {
    safetyScore: Math.min(100, safetyScore),
    threats: threats.slice(0, 5),
    recommendations,
    lastAnalyzed: new Date().toISOString(),
    totalScansAnalyzed: recentScans.length
  };
};

// GET /api/retailer/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const company = req.user?.company;

    const [totalProducts, totalScans, genuineScans, fakeScans, unresolvedAlerts, recentScans] = await Promise.all([
      Product.countDocuments({ company }),
      Scan.countDocuments(),
      Scan.countDocuments({ result: 'Genuine' }),
      Scan.countDocuments({ result: 'Fake' }),
      Alert.countDocuments({ company, resolved: false }),
      Scan.find().sort({ scanDate: -1 }).limit(10)
    ]);

    // Hourly scan trend (last 24h)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const hourlyTrend = await Scan.aggregate([
      { $match: { scanDate: { $gte: oneDayAgo } } },
      { $group: {
        _id: { $hour: '$scanDate' },
        scans: { $sum: 1 },
        genuine: { $sum: { $cond: [{ $eq: ['$result', 'Genuine'] }, 1, 0] } },
        fake: { $sum: { $cond: [{ $eq: ['$result', 'Fake'] }, 1, 0] } }
      }},
      { $sort: { _id: 1 } }
    ]);

    // Top scanned products
    const topScanned = await Scan.aggregate([
      { $group: { _id: '$productId', count: { $sum: 1 }, lastScan: { $max: '$scanDate' } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Verification rate
    const verificationRate = totalScans > 0 ? ((genuineScans / totalScans) * 100).toFixed(1) : '100.0';

    // Run AI agent
    const agentReport = await runCounterfeitAgent(company);

    res.json({
      stats: { totalProducts, totalScans, genuineScans, fakeScans, unresolvedAlerts, verificationRate },
      hourlyTrend,
      topScanned,
      recentScans,
      agentReport
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/retailer/verify-quick  — quick product lookup
exports.quickVerify = async (req, res) => {
  try {
    const { qrCode } = req.query;
    if (!qrCode) return res.status(400).json({ message: 'qrCode is required' });

    const product = await Product.findOne({ qrCode });
    if (!product) return res.status(404).json({ message: 'Product not found', result: 'Unknown' });

    const isExpired = product.expiryDate && new Date(product.expiryDate) < new Date();
    const result = isExpired ? 'Expired' : product.riskScore > 60 ? 'Suspicious' : 'Genuine';

    res.json({
      result,
      productName: product.productName,
      batchId: product.batchId,
      expiryDate: product.expiryDate,
      riskScore: product.riskScore,
      journeySteps: product.journeyHistory?.length || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
