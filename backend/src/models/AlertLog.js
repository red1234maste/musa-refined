const mongoose = require('mongoose');

const AlertLogSchema = new mongoose.Schema({
  cluster_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cluster', required: true },
  trigger_reason: { type: String, required: true },
  recipient_count: { type: Number, default: 0 },
  channels_used: [{ type: String, enum: ['sms', 'whatsapp', 'ivr'] }],
  messages_sent: [
    {
      farmer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer' },
      channel: { type: String },
      language: { type: String },
      message_text: { type: String }
    }
  ],
  fired_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AlertLog', AlertLogSchema);
