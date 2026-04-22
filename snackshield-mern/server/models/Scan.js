const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  result: { type: String, enum: ['Genuine', 'Fake', 'Suspicious'], required: true },
  location: { type: String, default: 'Unknown' },
  scanDate: { type: Date, default: Date.now },
  user: { type: String, default: 'Public' },
}, { timestamps: true });

module.exports = mongoose.model('Scan', scanSchema);
