const Cluster = require('../models/Cluster');
const { runClusteringPass } = require('../services/clustering');

async function getClusters(req, res) {
  try {
    const { status, pest_type } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (pest_type) filter.pest_type = pest_type;

    const clusters = await Cluster.find(filter)
      .populate({
        path: 'report_ids',
        populate: { path: 'farmer_id' }
      })
      .sort({ last_updated_at: -1 });

    return res.json({ success: true, count: clusters.length, clusters });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function getClusterById(req, res) {
  try {
    const cluster = await Cluster.findById(req.params.id).populate({
      path: 'report_ids',
      populate: { path: 'farmer_id' }
    });

    if (!cluster) return res.status(404).json({ error: 'Cluster not found' });
    return res.json({ success: true, cluster });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function triggerClusteringPassEndpoint(req, res) {
  try {
    const result = await runClusteringPass();
    return res.json({ success: true, message: 'Clustering pass executed.', result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = { getClusters, getClusterById, triggerClusteringPassEndpoint };
