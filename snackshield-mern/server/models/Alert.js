const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['Multiple Locations', 'Rapid Scanning', 'Invalid Verification', 'High Risk', 'Suspicious Pattern'],
    required: true 
  },
  severity: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  productId: { type: String, required: true },
  productName: { type: String },
  batchId: { type: String },
  message: { type: String, required: true },
  details: { type: String },
  locations: [{ type: String }],
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  resolved: { type: Boolean, default: false },
  assignedTo: { type: String },
  company: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);
