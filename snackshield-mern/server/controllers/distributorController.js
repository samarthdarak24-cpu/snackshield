const Product = require('../models/Product');
const Batch = require('../models/Batch');
const Scan = require('../models/Scan');
const Alert = require('../models/Alert');

// ─── AI Supply Chain Anomaly Agent ───────────────────────────────────────────
const runSupplyChainAgent = async (company) => {
  const products = await Product.find({ company }).limit(200);
  const alerts = await Alert.find({ company, resolved: false }).limit(50);

  const anomalies = [];
  const insights = [];

  // Detect products stuck in transit (no journey update > 3 days)
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  for (const p of products) {
    const lastStep = p.journeyHistory?.[p.journeyHistory.length - 1];
    if (lastStep?.role === 'Distributor' && new Date(lastStep.timestamp) < threeDaysAgo) {
      anomalies.push({
        type: 'stuck_in_transit',
        productId: p.qrCode,
        productName: p.productName,
        lastSeen: lastStep.city || lastStep.location,
        daysSinceUpdate: Math.floor((Date.now() - new Date(lastStep.timestamp)) / 86400000),
        severity: 'Medium',
        recommendation: `Product ${p.productName} has not moved in ${Math.floor((Date.now() - new Date(lastStep.timestamp)) / 86400000)} days. Verify with logistics partner.`
      });
    }
  }

  // Detect high-risk products
  const highRisk = products.filter(p => p.riskScore > 60);
  if (highRisk.length > 0) {
    insights.push({
      type: 'high_risk_products',
      count: highRisk.length,
      message: `${highRisk.length} product(s) have elevated risk scores. Immediate inspection recommended.`,
      severity: 'High'
    });
  }

  // Detect unresolved critical alerts
  const criticalAlerts = alerts.filter(a => a.severity === 'Critical');
  if (criticalAlerts.length > 0) {
    insights.push({
      type: 'critical_alerts',
      count: criticalAlerts.length,
      message: `${criticalAlerts.length} critical alert(s) require immediate attention.`,
      severity: 'Critical'
    });
  }

  // Supply chain health score
  const totalProducts = products.length || 1;
  const healthScore = Math.max(0, 100 - (anomalies.length * 5) - (highRisk.length * 10) - (criticalAlerts.length * 15));

  return {
    healthScore: Math.min(100, healthScore),
    anomalies: anomalies.slice(0, 5),
    insights,
    lastAnalyzed: new Date().toISOString(),
    totalAnalyzed: totalProducts
  };
};

// GET /api/distributor/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const company = req.user?.company;

    // Parallel data fetch
    const [totalProducts, totalBatches, totalScans, fakeScans, unresolvedAlerts, recentBatches, recentScans] = await Promise.all([
      Product.countDocuments({ company }),
      Batch.countDocuments(),
      Scan.countDocuments(),
      Scan.countDocuments({ result: 'Fake' }),
      Alert.countDocuments({ company, resolved: false }),
      Batch.find().sort({ createdAt: -1 }).limit(5),
      Scan.find().sort({ scanDate: -1 }).limit(10)
    ]);

    // Scan trend last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const scanTrend = await Scan.aggregate([
      { $match: { scanDate: { $gte: sevenDaysAgo } } },
      { $group: {
        _id: { $dateToString: { format: '%a', date: '$scanDate' } },
        total: { $sum: 1 },
        genuine: { $sum: { $cond: [{ $eq: ['$result', 'Genuine'] }, 1, 0] } },
        fake: { $sum: { $cond: [{ $eq: ['$result', 'Fake'] }, 1, 0] } }
      }},
      { $sort: { _id: 1 } }
    ]);

    // Products in each journey stage
    const journeyStages = await Product.aggregate([
      { $match: { company } },
      { $project: { lastRole: { $arrayElemAt: ['$journeyHistory.role', -1] } } },
      { $group: { _id: '$lastRole', count: { $sum: 1 } } }
    ]);

    // Run AI agent
    const agentReport = await runSupplyChainAgent(company);

    res.json({
      stats: { totalProducts, totalBatches, totalScans, fakeScans, unresolvedAlerts },
      scanTrend,
      journeyStages,
      recentBatches,
      recentScans,
      agentReport
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/distributor/shipments
exports.getShipments = async (req, res) => {
  try {
    const company = req.user?.company;
    const products = await Product.find({ company })
      .sort({ updatedAt: -1 })
      .limit(20)
      .select('productName batchId qrCode journeyHistory riskScore status');

    const shipments = products.map(p => {
      const lastStep = p.journeyHistory?.[p.journeyHistory.length - 1] || {};
      return {
        id: p.qrCode,
        productName: p.productName,
        batchId: p.batchId,
        currentStage: lastStep.role || 'Manufacturer',
        currentLocation: lastStep.city || lastStep.location || 'Unknown',
        status: lastStep.status || 'In Transit',
        riskScore: p.riskScore,
        lastUpdate: lastStep.timestamp
      };
    });

    res.json(shipments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
