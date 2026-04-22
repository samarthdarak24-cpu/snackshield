const mongoose = require('mongoose');

const journeyStepSchema = new mongoose.Schema({
  role: { type: String, enum: ['Manufacturer', 'Distributor', 'Retailer', 'Customer'], required: true },
  location: { type: String, required: true },
  city: { type: String },
  country: { type: String },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['Verified', 'In Transit', 'Delivered', 'Suspicious'], default: 'Verified' },
  user: { type: String },
  notes: { type: String }
});

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  company: { type: String, required: true },
  batchId: { type: String, required: true },
  qrCode: { type: String, unique: true },
  manufactureDate: { type: Date, default: Date.now },
  expiryDate: { type: Date },
  status: { type: String, default: 'Active' },
  blockchainHash: { type: String },
  journeyHistory: [journeyStepSchema],
  riskScore: { type: Number, default: 0, min: 0, max: 100 },
  lastRiskUpdate: { type: Date },
  totalScans: { type: Number, default: 0 },
  suspiciousScans: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
