const AlertLog = require('../models/AlertLog');
const Farmer = require('../models/Farmer');
const en = require('../locales/en.json');
const hi = require('../locales/hi.json');
const mr = require('../locales/mr.json');

const locales = { en, hi, mr };

/**
 * Triggers a multi-channel outbreak alert for a cluster.
 */
async function triggerClusterAlert(cluster) {
  try {
    const farmers = await Farmer.find();
    const messages = [];

    for (const farmer of farmers) {
      const lang = farmer.preferred_language || 'en';
      const loc = locales[lang] || locales.en;
      
      const messageText = loc.alert.body
        .replace('{{pest_type}}', cluster.pest_type)
        .replace('{{distinct_fields}}', cluster.distinct_field_count);

      messages.push({
        farmer_id: farmer._id,
        channel: farmer.phone ? 'sms' : 'whatsapp',
        language: lang,
        message_text: messageText
      });
    }

    const alertLog = new AlertLog({
      cluster_id: cluster._id,
      trigger_reason: `Outbreak confirmed across ${cluster.distinct_field_count} distinct fields with weight ${cluster.total_cluster_weight}`,
      recipient_count: farmers.length,
      channels_used: ['sms', 'whatsapp', 'ivr'],
      messages_sent: messages,
      fired_at: new Date()
    });

    await alertLog.save();

    console.log(`[ALERT DISPATCH] Outbreak alert fired for Cluster ${cluster._id} (${cluster.pest_type}) to ${farmers.length} farmers across SMS/WhatsApp/IVR!`);
    return alertLog;
  } catch (error) {
    console.error(`[ALERT ERROR] Failed to trigger cluster alert:`, error);
    throw error;
  }
}

module.exports = { triggerClusterAlert };
