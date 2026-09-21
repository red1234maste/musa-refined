const Report = require('../models/Report');
const Farmer = require('../models/Farmer');
const AgronomistReview = require('../models/AgronomistReview');
const { runClusteringPass } = require('../services/clustering');

async function getReviewQueue(req, res) {
  try {
    const pendingReports = await Report.find({
      status: { $in: ['verified_valid', 'flagged_duplicate', 'pending_classification'] }
    })
      .populate('farmer_id')
      .sort({ 'weight.total_weight': -1, created_at: -1 });

    return res.json({ success: true, count: pendingReports.length, reports: pendingReports });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function reviewReport(req, res) {
  try {
    const { id } = req.params;
    const { decision, notes = '' } = req.body; // 'confirm' or 'reject'

    if (!['confirm', 'reject'].includes(decision)) {
      return res.status(400).json({ error: 'Decision must be confirm or reject' });
    }

    const report = await Report.findById(id).populate('farmer_id');
    if (!report) return res.status(404).json({ error: 'Report not found' });

    const newStatus = decision === 'confirm' ? 'agronomist_confirmed' : 'agronomist_rejected';
    report.status = newStatus;
    await report.save();

    // Adjust farmer trust score
    const farmer = await Farmer.findById(report.farmer_id._id || report.farmer_id);
    if (farmer) {
      if (decision === 'confirm') {
        farmer.confirmed_reports_count += 1;
        farmer.trust_score = Math.min(2.0, farmer.trust_score + 0.15);
      } else {
        farmer.trust_score = Math.max(0.1, farmer.trust_score - 0.25);
      }
      await farmer.save();
    }

    const review = new AgronomistReview({
      report_id: report._id,
      agronomist_id: req.user?.id || 'agronomist_admin_01',
      decision,
      notes
    });

    await review.save();

    // Re-run clustering pass with updated report confirmation & trust score
    runClusteringPass().catch(err => console.error('[POST REVIEW CLUSTERING ERROR]', err));

    return res.json({
      success: true,
      message: `Report ${decision}ed successfully. Farmer trust score updated to ${farmer?.trust_score.toFixed(2)}`,
      report,
      review
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = { getReviewQueue, reviewReport };
