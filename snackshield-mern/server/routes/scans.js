const express = require('express');
const router = express.Router();
const scanController = require('../controllers/scanController');
const { protect, filterByCompany } = require('../middleware/auth');

// All scan routes require authentication
router.use(protect);
router.use(filterByCompany);

router.post('/scan-product', scanController.scanProduct);
router.get('/scan-history', scanController.getScanHistory);

module.exports = router;
