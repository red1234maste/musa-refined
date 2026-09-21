const express = require('express');
const { getReviewQueue, reviewReport } = require('../controllers/reviewController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, getReviewQueue);
router.post('/:id', authenticateToken, reviewReport);

module.exports = router;
