const Scan = require('../models/Scan');

exports.scanProduct = async (req, res) => {
  try {
    const { productId, result, location, user } = req.body;
    const scan = await Scan.create({ productId, result, location, user });
    
    // Emit real-time verification event
    const io = req.app.get('io');
    if (io) {
      const verificationEvent = {
        id: scan._id,
        productId,
        location,
        result,
        timestamp: new Date()
      };

      // Emit to all connected clients
      io.emit('productVerified', verificationEvent);
      io.emit('scanUpdate', verificationEvent);

      console.log('✅ Verification event emitted:', verificationEvent);
    }

    res.status(201).json(scan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getScanHistory = async (req, res) => {
  try {
    const scans = await Scan.find().sort({ scanDate: -1 });
    res.json(scans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
