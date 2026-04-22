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

module.exports = router;
