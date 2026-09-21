const {
  calculateWPhoto,
  calculateWDistinctness,
  calculateWDiversity,
  calculateWRecency,
  calculateWTrust,
  calculateReportWeight
} = require('../src/services/weighting');

describe('FieldWatch Weighting Engine Unit Tests', () => {
  test('calculateWPhoto applies duplicate penalty and IVR penalty correctly', () => {
    expect(calculateWPhoto({ confidence: 0.9, is_duplicate: false, channel: 'app' })).toBe(0.9);
    expect(calculateWPhoto({ confidence: 0.9, is_duplicate: true, channel: 'app' })).toBe(0.045);
    expect(calculateWPhoto({ confidence: 0.9, is_duplicate: false, channel: 'ivr' })).toBe(0.09);
  });

  test('calculateWDistinctness decays as reports on same field increase', () => {
    expect(calculateWDistinctness(1)).toBe(1.0);
    expect(calculateWDistinctness(2)).toBe(0.5);
    expect(calculateWDistinctness(4)).toBe(0.25);
  });

  test('calculateWDiversity increases with distinct fields and farmers', () => {
    expect(calculateWDiversity(1, 1)).toBe(1.0);
    expect(calculateWDiversity(3, 3)).toBe(1.6);
  });

  test('calculateWTrust floors trust score at 0.1 and caps at 2.0', () => {
    expect(calculateWTrust(0.05)).toBe(0.1);
    expect(calculateWTrust(1.5)).toBe(1.5);
    expect(calculateWTrust(2.5)).toBe(2.0);
  });

  test('calculateReportWeight multiplies all 5 factors accurately', () => {
    const weights = calculateReportWeight({
      confidence: 0.9,
      is_duplicate: false,
      channel: 'app',
      sameFieldCount: 1,
      distinctFieldCount: 2,
      distinctFarmerCount: 2,
      createdDate: new Date(),
      trustScore: 1.2
    });

    expect(weights.w_photo).toBe(0.9);
    expect(weights.w_distinctness).toBe(1.0);
    expect(weights.w_diversity).toBe(1.3);
    expect(weights.w_trust).toBe(1.2);
    expect(weights.total_weight).toBeGreaterThan(1.0);
  });
});
