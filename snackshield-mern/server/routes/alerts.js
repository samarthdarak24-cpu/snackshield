const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const { protect, filterByCompany } = require('../middleware/auth');

// All alert routes require authentication
router.use(protect);
router.use(filterByCompany);

router.get('/', alertController.getAlerts);
router.post('/', alertController.createAlert);
router.patch('/:alertId/read', alertController.markAsRead);
router.patch('/:alertId/resolve', alertController.resolveAlert);

// Test endpoint to trigger notifications
router.post('/test/trigger', (req, res) => {
  const io = req.app.get('io');
  if (!io) {
    return res.status(500).json({ message: 'Socket.IO not available' });
  }

  const testAlerts = [
    {
      _id: Date.now().toString(),
      message: 'Suspicious Scanning Pattern Detected',
      type: 'Rapid Scanning',
      productName: 'Premium Protein Bar - Chocolate',
      productId: 'SNK-2847',
      severity: 'Critical',
      details: 'Same QR code scanned 15 times in 2 minutes from different locations',
      timestamp: new Date(),
      locations: ['Mumbai, India', 'Delhi, India']
    },
    {
      _id: (Date.now() + 1).toString(),
      message: 'Product Verified Successfully',
      type: 'Verified',
      productName: 'Organic Energy Drink Mix',
      productId: 'SNK-1923',
      severity: 'Low',
      details: 'Product verified from Bangkok, Thailand',
      timestamp: new Date(),
      locations: ['Bangkok, Thailand']
    },
    {
      _id: (Date.now() + 2).toString(),
      message: 'Counterfeit Product Identified',
      type: 'High Risk',
      productName: 'Vitamin C Supplement Pack',
      productId: 'SNK-4521',
      severity: 'Critical',
      details: 'AI detection flagged packaging inconsistencies and invalid batch number',
      timestamp: new Date(),
      locations: ['Lagos, Nigeria']
    }
  ];

  // Emit a random test alert
  const randomAlert = testAlerts[Math.floor(Math.random() * testAlerts.length)];
  io.emit('newAlert', randomAlert);
  
  console.log('🧪 Test notification emitted:', randomAlert);
  res.json({ 
    message: 'Test notification sent', 
    alert: randomAlert 
  });
});

module.exports = router;
