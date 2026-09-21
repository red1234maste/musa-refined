const Report = require('../models/Report');
const Farmer = require('../models/Farmer');
const { classifyImage } = require('../services/mlClient');
const { calculateReportWeight } = require('../services/weighting');
const { runClusteringPass } = require('../services/clustering');
const enLocales = require('../locales/en.json');
const hiLocales = require('../locales/hi.json');
const mrLocales = require('../locales/mr.json');

const localeMap = { en: enLocales, hi: hiLocales, mr: mrLocales };

async function createReport(req, res) {
  try {
    const {
      farmer_phone,
      farmer_name,
      channel = 'app',
      field_id = 'FIELD_001',
      crop_type = 'Wheat',
      symptoms = [],
      preferred_language = 'en',
      latitude,
      longitude,
      photo_path
    } = req.body;

    // Verify mandatory GPS location
    if (latitude === undefined || longitude === undefined || latitude === null || longitude === null) {
      return res.status(400).json({
        error: 'GPS location (latitude, longitude) is strictly required for report ingestion.',
        code: 'MISSING_GPS'
      });
    }

    // Find or create farmer
    const phone = farmer_phone || '9876543210';
    let farmer = await Farmer.findOne({ phone });
    if (!farmer) {
      farmer = new Farmer({
        name: farmer_name || 'Farmer User',
        phone,
        preferred_language
      });
      await farmer.save();
    }

    farmer.total_reports_submitted += 1;
    await farmer.save();

    // Call Python ML Microservice for Image Classification & Duplicate Detection
    const imageToProcess = photo_path || (req.file ? req.file.path : 'sample_crop_leaf.jpg');
    const cv_result = await classifyImage(imageToProcess);

    // If image is invalid (non-plant, shoe, face, car)
    if (!cv_result.is_valid_image) {
      const loc = localeMap[preferred_language] || enLocales;
      const rejectedReport = new Report({
        farmer_id: farmer._id,
        channel,
        field_id,
        crop_type,
        symptoms,
        preferred_language,
        photo_path: imageToProcess,
        location: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
        cv_result,
        status: 'rejected_invalid_image',
        weight: { w_photo: 0, w_distinctness: 0, w_diversity: 0, w_recency: 0, w_trust: 0, total_weight: 0 }
      });
      await rejectedReport.save();

      return res.status(422).json({
        success: false,
        status: 'rejected_invalid_image',
        error: loc.rejection.non_plant,
        report_id: rejectedReport._id,
        cv_result
      });
    }

    // Calculate initial weights
    const weights = calculateReportWeight({
      confidence: cv_result.confidence,
      is_duplicate: cv_result.is_duplicate,
      channel,
      sameFieldCount: 1,
      distinctFieldCount: 1,
      distinctFarmerCount: 1,
      createdDate: new Date(),
      trustScore: farmer.trust_score
    });

    const reportStatus = cv_result.is_duplicate ? 'flagged_duplicate' : 'verified_valid';

    const report = new Report({
      farmer_id: farmer._id,
      channel,
      field_id,
      crop_type,
      symptoms,
      preferred_language,
      photo_path: imageToProcess,
      location: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
      cv_result,
      status: reportStatus,
      weight: weights
    });

    await report.save();

    // Execute clustering pass asynchronously
    runClusteringPass().catch(err => console.error('[CLUSTERING PASS ERROR]', err));

    return res.status(201).json({
      success: true,
      message: 'Report ingested successfully.',
      report
    });
  } catch (error) {
    console.error('[CREATE REPORT ERROR]', error);
    return res.status(500).json({ error: 'Server error while ingesting report.', details: error.message });
  }
}

async function getReports(req, res) {
  try {
    const { status, channel, pest_type } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (channel) filter.channel = channel;
    if (pest_type) filter['cv_result.pest_type'] = pest_type;

    const reports = await Report.find(filter).populate('farmer_id').sort({ created_at: -1 }).limit(100);
    return res.json({ success: true, count: reports.length, reports });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function getReportById(req, res) {
  try {
    const report = await Report.findById(req.params.id).populate('farmer_id');
    if (!report) return res.status(404).json({ error: 'Report not found' });
    return res.json({ success: true, report });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = { createReport, getReports, getReportById };
