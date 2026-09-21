const Report = require('../models/Report');
const Cluster = require('../models/Cluster');
const { calculateReportWeight } = require('./weighting');
const { triggerClusterAlert } = require('./alerting');

// Distance between two lat/lng coordinates in meters (Haversine formula)
function haversineDistanceMeters(coord1, coord2) {
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;
  const R = 6371000; // Radius of Earth in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Runs a full clustering pass over all unclustered valid reports.
 */
async function runClusteringPass(clusterRadiusMeters = 1000) {
  const reports = await Report.find({
    status: { $in: ['verified_valid', 'agronomist_confirmed'] }
  }).populate('farmer_id');

  if (!reports || reports.length === 0) {
    return { clustersEvaluated: 0, newAlertsFired: 0 };
  }

  let clustersEvaluated = 0;
  let newAlertsFired = 0;

  // Group reports by pest_type first
  const pestGroups = {};
  for (const report of reports) {
    const pest = report.cv_result?.pest_type || 'Unknown Pest';
    if (!pestGroups[pest]) pestGroups[pest] = [];
    pestGroups[pest].push(report);
  }

  for (const pest_type of Object.keys(pestGroups)) {
    const group = pestGroups[pest_type];
    const processedReportIds = new Set();

    for (let i = 0; i < group.length; i++) {
      const seedReport = group[i];
      if (processedReportIds.has(seedReport._id.toString())) continue;

      // Find all reports within spatial radius of seedReport
      const clusterReports = [seedReport];
      processedReportIds.add(seedReport._id.toString());

      for (let j = i + 1; j < group.length; j++) {
        const candidate = group[j];
        if (processedReportIds.has(candidate._id.toString())) continue;

        const dist = haversineDistanceMeters(
          seedReport.location.coordinates,
          candidate.location.coordinates
        );

        if (dist <= clusterRadiusMeters) {
          clusterReports.push(candidate);
          processedReportIds.add(candidate._id.toString());
        }
      }

      // Calculate centroid and distinct field count
      const distinctFields = new Set(clusterReports.map(r => r.field_id));
      const distinctFarmers = new Set(clusterReports.map(r => r.farmer_id?._id?.toString() || r.farmer_id.toString()));

      let sumLon = 0;
      let sumLat = 0;
      let totalClusterWeight = 0;

      for (const r of clusterReports) {
        sumLon += r.location.coordinates[0];
        sumLat += r.location.coordinates[1];

        // Recalculate report weights with cluster context
        const weights = calculateReportWeight({
          confidence: r.cv_result?.confidence || 0.85,
          is_duplicate: r.cv_result?.is_duplicate || false,
          channel: r.channel,
          sameFieldCount: clusterReports.filter(cr => cr.field_id === r.field_id).length,
          distinctFieldCount: distinctFields.size,
          distinctFarmerCount: distinctFarmers.size,
          createdDate: r.created_at,
          trustScore: r.farmer_id?.trust_score || 1.0
        });

        r.weight = weights;
        await r.save();

        totalClusterWeight += weights.total_weight;
      }

      const centroid = [
        Number((sumLon / clusterReports.length).toFixed(6)),
        Number((sumLat / clusterReports.length).toFixed(6))
      ];

      // Check if cluster already exists in DB nearby
      let existingCluster = await Cluster.findOne({
        pest_type,
        centroid: {
          $near: {
            $geometry: { type: 'Point', coordinates: centroid },
            $maxDistance: clusterRadiusMeters
          }
        }
      });

      const reportIds = clusterReports.map(r => r._id);
      const isOutbreakThresholdMet = distinctFields.size >= 3;

      if (existingCluster) {
        clustersEvaluated++;
        existingCluster.report_ids = Array.from(new Set([...existingCluster.report_ids.map(id => id.toString()), ...reportIds.map(id => id.toString())]));
        existingCluster.distinct_field_count = distinctFields.size;
        existingCluster.total_cluster_weight = Number(totalClusterWeight.toFixed(4));
        existingCluster.centroid.coordinates = centroid;
        existingCluster.last_updated_at = new Date();

        // Check alert logic & post-alert dampening
        if (isOutbreakThresholdMet && existingCluster.status !== 'alert_confirmed') {
          existingCluster.status = 'alert_confirmed';
          existingCluster.alert_fired_at = new Date();
          await triggerClusterAlert(existingCluster);
          newAlertsFired++;
        } else if (existingCluster.status === 'alert_confirmed' && clusterReports.length > 5) {
          // Post-alert dampening active
          existingCluster.dampening_active = true;
          existingCluster.status = 'dampened';
        }

        await existingCluster.save();
        for (const r of clusterReports) {
          r.cluster_id = existingCluster._id;
          await r.save();
        }
      } else {
        clustersEvaluated++;
        const initialStatus = isOutbreakThresholdMet ? 'alert_confirmed' : 'active_unconfirmed';
        const newCluster = new Cluster({
          centroid: { type: 'Point', coordinates: centroid },
          radius_meters: clusterRadiusMeters,
          pest_type,
          status: initialStatus,
          distinct_field_count: distinctFields.size,
          total_cluster_weight: Number(totalClusterWeight.toFixed(4)),
          report_ids: reportIds,
          alert_fired_at: isOutbreakThresholdMet ? new Date() : null
        });

        await newCluster.save();

        if (isOutbreakThresholdMet) {
          await triggerClusterAlert(newCluster);
          newAlertsFired++;
        }

        for (const r of clusterReports) {
          r.cluster_id = newCluster._id;
          await r.save();
        }
      }
    }
  }

  return { clustersEvaluated, newAlertsFired };
}

module.exports = {
  haversineDistanceMeters,
  runClusteringPass
};
