const express = require('express');
const router = express.Router();
const distributorController = require('../controllers/distributorController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/dashboard', distributorController.getDashboard);
router.get('/shipments', distributorController.getShipments);

module.exports = router;
