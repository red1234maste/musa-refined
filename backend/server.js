require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./src/config/db');
const { startClusterCron } = require('./src/jobs/clusterCron');
const Farmer = require('./src/models/Farmer');
const Report = require('./src/models/Report');
const { runClusteringPass } = require('./src/services/clustering');

const PORT = process.env.PORT || 5000;

async function seedInitialDemoData() {
  const reportCount = await Report.countDocuments();
  if (reportCount >= 14) return;

  console.log('[SEED] Pre-populating 14 authentic Solapur village demo reports & farmers...');

  let farmer1 = await Farmer.findOne({ phone: '9876543210' });
  if (!farmer1) {
    farmer1 = await Farmer.create({
      name: 'Ramesh Patil',
      phone: '9876543210',
      preferred_language: 'hi',
      trust_score: 1.2,
      village: 'Kasbe Solapur'
    });
  }

  let farmer2 = await Farmer.findOne({ phone: '9876543211' });
  if (!farmer2) {
    farmer2 = await Farmer.create({
      name: 'Sunita Deshmukh',
      phone: '9876543211',
      preferred_language: 'mr',
      trust_score: 1.5,
      village: 'Shelgi Cluster'
    });
  }

  let farmer3 = await Farmer.findOne({ phone: '9876543212' });
  if (!farmer3) {
    farmer3 = await Farmer.create({
      name: 'Anil Kumar',
      phone: '9876543212',
      preferred_language: 'en',
      trust_score: 1.0,
      village: 'Degaon Village'
    });
  }

  // Clear sparse data and seed 14 authentic Solapur reports
  await Report.deleteMany({});

  const demoReports = [
    {
      farmer_id: farmer1._id,
      channel: 'app',
      field_id: 'FIELD_KASBE_01',
      crop_type: 'Maize',
      symptoms: ['Insect Damage / Worms', 'Leaf Spots / Rust'],
      preferred_language: 'hi',
      location: { type: 'Point', coordinates: [75.9064, 17.6599] },
      cv_result: { is_valid_image: true, confidence: 0.94, pest_type: 'Fall Armyworm', is_duplicate: false },
      status: 'verified_valid',
      created_at: new Date()
    },
    {
      farmer_id: farmer2._id,
      channel: 'pwa',
      field_id: 'FIELD_KASBE_02',
      crop_type: 'Maize',
      symptoms: ['Insect Damage / Worms'],
      preferred_language: 'mr',
      location: { type: 'Point', coordinates: [75.9095, 17.6620] },
      cv_result: { is_valid_image: true, confidence: 0.91, pest_type: 'Fall Armyworm', is_duplicate: false },
      status: 'verified_valid',
      created_at: new Date()
    },
    {
      farmer_id: farmer3._id,
      channel: 'ivr',
      field_id: 'FIELD_KASBE_03',
      crop_type: 'Maize',
      symptoms: ['Insect Damage / Worms'],
      preferred_language: 'en',
      location: { type: 'Point', coordinates: [75.9120, 17.6580] },
      cv_result: { is_valid_image: true, confidence: 0.88, pest_type: 'Fall Armyworm', is_duplicate: false },
      status: 'verified_valid',
      created_at: new Date()
    },
    {
      farmer_id: farmer1._id,
      channel: 'app',
      field_id: 'FIELD_DEGAON_01',
      crop_type: 'Rice',
      symptoms: ['Yellowing / Discoloration'],
      preferred_language: 'mr',
      location: { type: 'Point', coordinates: [75.8750, 17.6450] },
      cv_result: { is_valid_image: true, confidence: 0.86, pest_type: 'Brown Planthopper', is_duplicate: false },
      status: 'verified_valid',
      created_at: new Date()
    },
    {
      farmer_id: farmer2._id,
      channel: 'ivr',
      field_id: 'FIELD_DEGAON_02',
      crop_type: 'Rice',
      symptoms: ['Leaf Spots / Rust'],
      preferred_language: 'hi',
      location: { type: 'Point', coordinates: [75.8780, 17.6480] },
      cv_result: { is_valid_image: true, confidence: 0.89, pest_type: 'Rice Stem Borer', is_duplicate: false },
      status: 'verified_valid',
      created_at: new Date()
    },
    {
      farmer_id: farmer3._id,
      channel: 'pwa',
      field_id: 'FIELD_SHELGI_01',
      crop_type: 'Wheat',
      symptoms: ['Leaf Spots / Rust'],
      preferred_language: 'en',
      location: { type: 'Point', coordinates: [75.9220, 17.6850] },
      cv_result: { is_valid_image: true, confidence: 0.93, pest_type: 'Yellow Rust', is_duplicate: false },
      status: 'verified_valid',
      created_at: new Date()
    },
    {
      farmer_id: farmer1._id,
      channel: 'app',
      field_id: 'FIELD_SHELGI_02',
      crop_type: 'Wheat',
      symptoms: ['Wilting / Stunting'],
      preferred_language: 'hi',
      location: { type: 'Point', coordinates: [75.9250, 17.6880] },
      cv_result: { is_valid_image: true, confidence: 0.87, pest_type: 'Leaf Blight', is_duplicate: false },
      status: 'verified_valid',
      created_at: new Date()
    },
    {
      farmer_id: farmer2._id,
      channel: 'pwa',
      field_id: 'FIELD_JULE_01',
      crop_type: 'Cotton',
      symptoms: ['Insect Damage / Worms'],
      preferred_language: 'mr',
      location: { type: 'Point', coordinates: [75.8950, 17.6320] },
      cv_result: { is_valid_image: true, confidence: 0.90, pest_type: 'Pink Bollworm', is_duplicate: false },
      status: 'verified_valid',
      created_at: new Date()
    },
    {
      farmer_id: farmer3._id,
      channel: 'ivr',
      field_id: 'FIELD_MULEGAON_01',
      crop_type: 'Sugarcane',
      symptoms: ['Wilting / Stunting'],
      preferred_language: 'en',
      location: { type: 'Point', coordinates: [75.9520, 17.6510] },
      cv_result: { is_valid_image: true, confidence: 0.85, pest_type: 'Early Shoot Borer', is_duplicate: false },
      status: 'verified_valid',
      created_at: new Date()
    },
    {
      farmer_id: farmer1._id,
      channel: 'app',
      field_id: 'FIELD_MULEGAON_02',
      crop_type: 'Sugarcane',
      symptoms: ['Yellowing / Discoloration'],
      preferred_language: 'hi',
      location: { type: 'Point', coordinates: [75.9560, 17.6540] },
      cv_result: { is_valid_image: true, confidence: 0.84, pest_type: 'Whitefly', is_duplicate: false },
      status: 'verified_valid',
      created_at: new Date()
    },
    {
      farmer_id: farmer2._id,
      channel: 'pwa',
      field_id: 'FIELD_KEGAON_01',
      crop_type: 'Tomato',
      symptoms: ['Leaf Spots / Rust'],
      preferred_language: 'mr',
      location: { type: 'Point', coordinates: [75.8500, 17.6750] },
      cv_result: { is_valid_image: true, confidence: 0.95, pest_type: 'Early Blight', is_duplicate: false },
      status: 'verified_valid',
      created_at: new Date()
    },
    {
      farmer_id: farmer3._id,
      channel: 'ivr',
      field_id: 'FIELD_SOREGAON_01',
      crop_type: 'Rice',
      symptoms: ['Insect Damage / Worms'],
      preferred_language: 'en',
      location: { type: 'Point', coordinates: [75.8850, 17.6150] },
      cv_result: { is_valid_image: true, confidence: 0.89, pest_type: 'Paddy Stem Borer', is_duplicate: false },
      status: 'verified_valid',
      created_at: new Date()
    },
    {
      farmer_id: farmer1._id,
      channel: 'app',
      field_id: 'FIELD_BHAVANI_01',
      crop_type: 'Cotton',
      symptoms: ['Yellowing / Discoloration'],
      preferred_language: 'hi',
      location: { type: 'Point', coordinates: [75.9200, 17.6480] },
      cv_result: { is_valid_image: true, confidence: 0.86, pest_type: 'Cotton Aphids', is_duplicate: false },
      status: 'verified_valid',
      created_at: new Date()
    },
    {
      farmer_id: farmer2._id,
      channel: 'ivr',
      field_id: 'FIELD_VIJAPUR_01',
      crop_type: 'Wheat',
      symptoms: ['Leaf Spots / Rust'],
      preferred_language: 'mr',
      location: { type: 'Point', coordinates: [75.9010, 17.6280] },
      cv_result: { is_valid_image: true, confidence: 0.91, pest_type: 'Wheat Leaf Rust', is_duplicate: false },
      status: 'verified_valid',
      created_at: new Date()
    }
  ];

  await Report.create(demoReports);
  console.log('[SEED] 14 authentic Solapur village reports seeded successfully. Executing initial clustering pass...');
  await runClusteringPass();
}

async function startServer() {
  await connectDB();
  await seedInitialDemoData();
  startClusterCron();

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` FieldWatch Node Backend Server running on port ${PORT} `);
    console.log(` API Endpoint: http://localhost:${PORT}/api/health `);
    console.log(`=======================================================`);
  });
}

startServer();
