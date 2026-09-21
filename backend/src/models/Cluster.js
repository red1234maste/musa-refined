const mongoose = require('mongoose');

const ClusterSchema = new mongoose.Schema({
  centroid: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  radius_meters: { type: Number, default: 500 },
  pest_type: { type: String, required: true },
  status: {
    type: String,
    enum: ['active_unconfirmed', 'alert_confirmed', 'resolved', 'dampened'],
    default: 'active_unconfirmed'
  },
  distinct_field_count: { type: Number, default: 1 },
  total_cluster_weight: { type: Number, default: 1.0 },
  report_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Report' }],
  alert_fired_at: { type: Date, default: null },
  dampening_active: { type: Boolean, default: false },
  last_updated_at: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now }
});

ClusterSchema.index({ centroid: '2dsphere' });

module.exports = mongoose.model('Cluster', ClusterSchema);
