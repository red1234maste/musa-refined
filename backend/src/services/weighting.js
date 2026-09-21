/**
 * FieldWatch Weighting Calculator
 * Pure function module for calculating report weights
 */

/**
 * Calculates w_photo based on ML confidence, duplicate flag, and ingestion channel.
 */
function calculateWPhoto({ confidence = 0.85, is_duplicate = false, channel = 'app' }) {
  let w = confidence;
  if (is_duplicate) {
    w *= 0.05; // severe penalty for duplicate/copycat image
  }
  if (channel === 'ivr') {
    w *= 0.1; // IVR has no photo evidence, near-zero photo weight
  }
  return Number(w.toFixed(4));
}

/**
 * Calculates w_distinctness based on existing reports from the same field.
 * Collapses duplicate reports on the same field (within 30-50m).
 */
function calculateWDistinctness(reportsOnSameFieldCount = 1) {
  if (reportsOnSameFieldCount <= 1) return 1.0;
  return Number((1 / reportsOnSameFieldCount).toFixed(4));
}

/**
 * Calculates w_diversity based on the number of distinct fields and farmers contributing to a cluster.
 */
function calculateWDiversity(distinctFieldCount = 1, distinctFarmerCount = 1) {
  const diversity = 1.0 + (distinctFieldCount - 1) * 0.2 + (distinctFarmerCount - 1) * 0.1;
  return Number(Math.min(diversity, 2.0).toFixed(4));
}

/**
 * Calculates w_recency based on report age in hours.
 * Uses exponential decay: e^(-lambda * ageInHours)
 */
function calculateWRecency(createdDate, referenceDate = new Date(), halfLifeHours = 24) {
  const ageMs = Math.max(0, referenceDate.getTime() - new Date(createdDate).getTime());
  const ageHours = ageMs / (1000 * 60 * 60);
  const lambda = Math.LN2 / halfLifeHours;
  const decay = Math.exp(-lambda * ageHours);
  return Number(decay.toFixed(4));
}

/**
 * Calculates w_trust from farmer's trust score (floored at 0.1).
 */
function calculateWTrust(trustScore = 1.0) {
  const trust = Math.max(0.1, Math.min(2.0, trustScore));
  return Number(trust.toFixed(4));
}

/**
 * Calculates total weight combining all 5 factors.
 * total_weight = w_photo * w_distinctness * w_diversity * w_recency * w_trust
 */
function calculateReportWeight({
  confidence = 0.85,
  is_duplicate = false,
  channel = 'app',
  sameFieldCount = 1,
  distinctFieldCount = 1,
  distinctFarmerCount = 1,
  createdDate = new Date(),
  trustScore = 1.0,
  referenceDate = new Date()
}) {
  const w_photo = calculateWPhoto({ confidence, is_duplicate, channel });
  const w_distinctness = calculateWDistinctness(sameFieldCount);
  const w_diversity = calculateWDiversity(distinctFieldCount, distinctFarmerCount);
  const w_recency = calculateWRecency(createdDate, referenceDate);
  const w_trust = calculateWTrust(trustScore);

  const total_weight = Number(
    (w_photo * w_distinctness * w_diversity * w_recency * w_trust).toFixed(4)
  );

  return {
    w_photo,
    w_distinctness,
    w_diversity,
    w_recency,
    w_trust,
    total_weight
  };
}

module.exports = {
  calculateWPhoto,
  calculateWDistinctness,
  calculateWDiversity,
  calculateWRecency,
  calculateWTrust,
  calculateReportWeight
};
