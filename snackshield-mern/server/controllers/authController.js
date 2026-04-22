const User = require('../models/User');
const jwt = require('jsonwebtoken');
const blockchainService = require('../services/blockchainService');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, company, walletAddress } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, role, company, walletAddress });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'SECRETKEY', { expiresIn: '1d' });

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'SECRETKEY', { expiresIn: '1d' });
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    let sstBalance = '0.0';
    if (user.walletAddress) {
      sstBalance = await blockchainService.getTokenBalance(user.walletAddress);
    }

    res.json({
      user,
      sstBalance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
