const Scan = require('../models/Scan');

exports.scanProduct = async (req, res) => {
  try {
    const { productId, result, location, user } = req.body;
    const scan = await Scan.create({ productId, result, location, user });
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
