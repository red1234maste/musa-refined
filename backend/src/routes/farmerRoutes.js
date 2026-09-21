const express = require('express');
const { getFarmers, getFarmerTrust } = require('../controllers/farmerController');

const router = express.Router();

router.get('/', getFarmers);
router.get('/:id/trust', getFarmerTrust);

module.exports = router;
