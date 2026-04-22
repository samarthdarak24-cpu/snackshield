const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, filterByCompany } = require('../middleware/auth');

// Public routes (no authentication required)
router.post('/verify-product', productController.verifyProduct);
router.get('/:productId/journey', productController.getProductJourney);
router.get('/:productId/risk-score', productController.getRiskScore);

// Protected routes (authentication required)
router.use(protect);
router.use(filterByCompany);

router.post('/create-product', productController.createProduct);
router.get('/', productController.getProducts);

module.exports = router;
