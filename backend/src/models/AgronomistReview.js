const mongoose = require('mongoose');

const AgronomistReviewSchema = new mongoose.Schema({
  report_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Report', required: true },
  agronomist_id: { type: String, default: 'agronomist_admin_01' },
  decision: { type: String, enum: ['confirm', 'reject'], required: true },
  notes: { type: String, default: '' },
  reviewed_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AgronomistReview', AgronomistReviewSchema);
