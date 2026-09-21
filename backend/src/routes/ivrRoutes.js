const express = require('express');
const { processIVRStep } = require('../controllers/ivrController');

const router = express.Router();

router.post('/session', processIVRStep);

module.exports = router;
