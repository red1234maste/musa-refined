const express = require('express');
const multer = require('multer');
const path = require('path');
const { createReport, getReports, getReportById } = require('../controllers/reportController');
const { validateImageMagicBytes } = require('../middleware/validateUpload');

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/', upload.single('photo'), validateImageMagicBytes, createReport);
router.get('/', getReports);
router.get('/:id', getReportById);

module.exports = router;
