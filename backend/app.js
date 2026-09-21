const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const reportRoutes = require('./src/routes/reportRoutes');
const clusterRoutes = require('./src/routes/clusterRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const farmerRoutes = require('./src/routes/farmerRoutes');
const ivrRoutes = require('./src/routes/ivrRoutes');
const alertRoutes = require('./src/routes/alertRoutes');

const app = express();

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsDir));

// API routes
app.use('/api/reports', reportRoutes);
app.use('/api/clusters', clusterRoutes);
app.use('/api/review-queue', reviewRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/ivr', ivrRoutes);
app.use('/api/alerts', alertRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'FieldWatch Backend', timestamp: new Date() });
});

module.exports = app;
