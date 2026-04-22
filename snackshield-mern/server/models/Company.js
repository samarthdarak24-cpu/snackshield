const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  industry: {
    type: String,
    required: true
  },
  location: {
    type: String,
    default: 'Mumbai, India'
  },
  verified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Active', 'Pending', 'Inactive'],
    default: 'Active'
  },
  nodeCount: {
    type: Number,
    default: 0
  },
  onboardedDate: {
    type: Date,
    default: Date.now
  },
  logoColor: {
    type: String,
    default: 'from-blue-500 to-indigo-600'
  },
  description: String,
  compliance: [String]
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
