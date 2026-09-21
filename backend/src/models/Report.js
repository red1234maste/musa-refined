const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  farmer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  channel: { type: String, enum: ['app', 'pwa', 'ivr'], required: true },
  field_id: { type: String, required: true },
  crop_type: { type: String, default: 'Wheat' },
  symptoms: [{ type: String }],
  photo_path: { type: String, default: null },
  preferred_language: { type: String, enum: ['en', 'hi', 'mr'], default: 'en' },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  cv_result: {
    is_valid_image: { type: Boolean, default: true },
    rejection_reason: { type: String, default: null },
    confidence: { type: Number, default: 0.85 },
    pest_type: { type: String, default: 'Fall Armyworm' },
    is_duplicate: { type: Boolean, default: false },
    photo_hash: { type: String, default: null }
  },
  status: {
    type: String,
    enum: [
      'pending_classification',
      'rejected_invalid_image',
      'verified_valid',
      'flagged_duplicate',
      'agronomist_confirmed',
      'agronomist_rejected'
    ],
    default: 'verified_valid'
  },
  weight: {
    w_photo: { type: Number, default: 1.0 },
    w_distinctness: { type: Number, default: 1.0 },
    w_diversity: { type: Number, default: 1.0 },
    w_recency: { type: Number, default: 1.0 },
    w_trust: { type: Number, default: 1.0 },
    total_weight: { type: Number, default: 1.0 }
  },
  cluster_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cluster', default: null },
  created_at: { type: Date, default: Date.now }
});

ReportSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Report', ReportSchema);
