const express = require('express');
const AlertLog = require('../models/AlertLog');
const Cluster = require('../models/Cluster');
const { triggerClusterAlert } = require('../services/alerting');

const router = express.Router();

router.get('/log', async (req, res) => {
  try {
    const logs = await AlertLog.find().populate('cluster_id').sort({ fired_at: -1 });
    return res.json({ success: true, count: logs.length, logs });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/test-trigger', async (req, res) => {
  try {
    const { cluster_id } = req.body;
    let cluster;
    if (cluster_id) {
      cluster = await Cluster.findById(cluster_id);
    } else {
      cluster = await Cluster.findOne();
    }

    if (!cluster) {
      cluster = new Cluster({
        centroid: { type: 'Point', coordinates: [75.7139, 19.7515] },
        pest_type: 'Fall Armyworm',
        status: 'alert_confirmed',
        distinct_field_count: 3,
        total_cluster_weight: 4.2
      });
      await cluster.save();
    }

    const alertLog = await triggerClusterAlert(cluster);
    return res.json({ success: true, message: 'Test alert fired successfully', alertLog });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
