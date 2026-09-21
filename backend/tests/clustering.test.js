const { haversineDistanceMeters } = require('../src/services/clustering');

describe('FieldWatch Spatial Clustering Unit Tests', () => {
  test('haversineDistanceMeters accurately computes distance between coordinates', () => {
    const coord1 = [75.7139, 19.7515];
    const coord2 = [75.7145, 19.7520]; // approx 80 meters apart
    const distance = haversineDistanceMeters(coord1, coord2);
    expect(distance).toBeGreaterThan(50);
    expect(distance).toBeLessThan(120);
  });
});
