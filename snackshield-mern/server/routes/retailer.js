const express = require('express');
const router = express.Router();
const retailerController = require('../controllers/retailerController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/dashboard', retailerController.getDashboard);
router.get('/verify-quick', retailerController.quickVerify);

module.exports = router;
