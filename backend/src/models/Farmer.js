const mongoose = require('mongoose');

const FarmerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  preferred_language: { type: String, enum: ['en', 'hi', 'mr'], default: 'en' },
  trust_score: { type: Number, default: 1.0, min: 0.1, max: 2.0 },
  village: { type: String, default: 'Village Alpha' },
  state: { type: String, default: 'Maharashtra' },
  total_reports_submitted: { type: Number, default: 0 },
  confirmed_reports_count: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Farmer', FarmerSchema);
