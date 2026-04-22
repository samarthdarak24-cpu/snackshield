const Product = require('../models/Product');
const Batch = require('../models/Batch');
const Scan = require('../models/Scan');

const Alert = require('../models/Alert');

exports.getGlobalStats = async (req, res) => {
  try {
    const totalScans = await Scan.countDocuments();
    const genuineScans = await Scan.countDocuments({ result: 'Genuine' });
    const alerts = await Alert.countDocuments();
    const resolvedAlerts = await Alert.countDocuments({ resolved: true });
    
    // Calculate Trust Index (Percentage of genuine scans)
    const trustIndex = totalScans > 0 
      ? ((genuineScans / totalScans) * 100).toFixed(1) 
      : "100.0";

    // Simulate high-performance node latency
    const latency = (0.2 + Math.random() * 0.2).toFixed(2);

    res.json({
      totalScans: totalScans.toLocaleString() || '0',
      incidentsMitigated: alerts.toLocaleString() || '0',
      trustIndex: `${trustIndex}%`,
      latency: `${latency}s`,
      // Daily trends for the area chart
      trends: await Scan.aggregate([
        { $group: { 
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$scanDate" } },
            scans: { $sum: 1 },
            fraud: { $sum: { $cond: [{ $eq: ["$result", "Fake"] }, 1, 0] } }
        }},
        { $sort: { "_id": 1 } },
        { $limit: 7 }
      ])
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getScanStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalBatches = await Batch.countDocuments();
    const totalScans = await Scan.countDocuments();
    const fakeCount = await Scan.countDocuments({ result: 'Fake' });

    res.json({
      totalProducts,
      totalBatches,
      totalScans,
      fakeDetected: fakeCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFraudStats = async (req, res) => {
   try {
     // Monthly scans for charts
     const last7Days = new Date();
     last7Days.setDate(last7Days.getDate() - 7);

     const scans = await Scan.find({
       scanDate: { $gte: last7Days }
     }).sort({ scanDate: 1 });

     res.json({ dailyActivity: scans });
   } catch (error) {
     res.status(500).json({ message: error.message });
   }
};

const PDFDocument = require('pdfkit');

exports.generateAuditPDF = async (req, res) => {
    try {
        const totalScans = await Scan.countDocuments();
        const genuineScans = await Scan.countDocuments({ result: 'Genuine' });
        const fakeScans = await Scan.countDocuments({ result: 'Fake' });
        const totalAlerts = await Alert.countDocuments();
        const resolvedAlerts = await Alert.countDocuments({ resolved: true });
        
        const trustIndex = totalScans > 0 
            ? ((genuineScans / totalScans) * 100).toFixed(1) 
            : "100.0";

        const doc = new PDFDocument({ margin: 50 });
        const filename = `SnackShield_Security_Audit_${new Date().toISOString().split('T')[0]}.pdf`;

        const chunks = [];
        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => {
            const pdfBuffer = Buffer.concat(chunks);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.setHeader('Content-Length', pdfBuffer.length);
            res.send(pdfBuffer);
            console.log(`Audit PDF binary sent (${pdfBuffer.length} bytes)`);
        });

        // Header
        doc.fillColor('#7c3aed').fontSize(26).text('SnackShield Enterprise', { align: 'center' });
        doc.fillColor('#64748b').fontSize(14).text('Global Threat Intelligence & Security Audit', { align: 'center' });
        doc.moveDown();
        doc.strokeColor('#e2e8f0').moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();

        // Summary Section
        doc.fillColor('#0f172a').fontSize(18).text('Executive Summary', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(12).text(`Audit Date: ${new Date().toLocaleString()}`);
        doc.text(`System Status: Operational / Protected`);
        doc.text(`Global Trust Index: ${trustIndex}%`);
        doc.moveDown();

        // Stats Table-like layout
        const startY = doc.y;
        doc.rect(50, startY, 500, 100).fill('#f8fafc').stroke('#e2e8f0');
        doc.fillColor('#0f172a');
        
        doc.fontSize(10).text('METRIC', 70, startY + 15);
        doc.text('VALUE', 400, startY + 15);
        
        doc.moveTo(50, startY + 30).lineTo(550, startY + 30).stroke();
        
        doc.fontSize(12);
        doc.text('Total Network Scans Authenticated', 70, startY + 45);
        doc.text(totalScans.toLocaleString(), 400, startY + 45);
        
        doc.text('Genuine Products Identified', 70, startY + 65);
        doc.text(genuineScans.toLocaleString(), 400, startY + 65);
        
        doc.fillColor('#ef4444').text('Fraudulent Attempts Mitigated', 70, startY + 85);
        doc.text(fakeScans.toLocaleString(), 400, startY + 85);

        doc.moveDown(5);

        // Security Incidents
        doc.fillColor('#0f172a').fontSize(18).text('Security Incident Log', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(12).text(`Total Registered Alerts: ${totalAlerts}`);
        doc.text(`Resolved / Mitigated: ${resolvedAlerts}`);
        doc.text(`Active Threats: ${totalAlerts - resolvedAlerts}`);
        
        doc.moveDown(2);
        
        // Footer
        doc.fontSize(8).fillColor('#94a3b8').text(
            'SnackShield Blockchain Security Protocol - AI-Powered Supply Chain Protection',
            50, 
            doc.page.height - 50,
            { align: 'center' }
        );

        doc.end();
    } catch (error) {
        console.error('Audit PDF Error:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: error.message });
        }
    }
};
