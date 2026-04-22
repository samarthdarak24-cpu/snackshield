const express = require('express');
const router = express.Router();
const batchController = require('../controllers/batchController');
const { protect, filterByCompany } = require('../middleware/auth');

// All batch routes require authentication
router.use(protect);
router.use(filterByCompany);

router.post('/create-batch', batchController.createBatch);
router.get('/', batchController.getBatches);
router.get('/:batchId/units', batchController.getBatchUnits);
router.get('/:batchId/download-pdf', batchController.downloadBatchPDF);

module.exports = router;
