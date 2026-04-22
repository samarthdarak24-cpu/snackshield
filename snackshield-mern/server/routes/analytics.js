const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect, filterByCompany } = require('../middleware/auth');

// All analytics routes require authentication
router.use(protect);
router.use(filterByCompany);

router.get('/scan-stats', analyticsController.getScanStats);
router.get('/fraud-stats', analyticsController.getFraudStats);
router.get('/global-stats', analyticsController.getGlobalStats);
router.get('/download-audit-pdf', analyticsController.generateAuditPDF);

module.exports = router;
