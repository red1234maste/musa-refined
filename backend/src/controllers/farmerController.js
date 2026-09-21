const Farmer = require('../models/Farmer');
const Report = require('../models/Report');

async function getFarmers(req, res) {
  try {
    const farmers = await Farmer.find().sort({ trust_score: -1 });
    return res.json({ success: true, count: farmers.length, farmers });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function getFarmerTrust(req, res) {
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) return res.status(404).json({ error: 'Farmer not found' });
    const reports = await Report.find({ farmer_id: farmer._id });

    return res.json({
      success: true,
      farmer_id: farmer._id,
      name: farmer.name,
      trust_score: farmer.trust_score,
      total_reports: farmer.total_reports_submitted,
      confirmed_reports: farmer.confirmed_reports_count,
      reports_history: reports
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = { getFarmers, getFarmerTrust };
