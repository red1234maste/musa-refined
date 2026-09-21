const express = require('express');
const { getClusters, getClusterById, triggerClusteringPassEndpoint } = require('../controllers/clusterController');

const router = express.Router();

router.get('/', getClusters);
router.get('/:id', getClusterById);
router.post('/trigger-pass', triggerClusteringPassEndpoint);

module.exports = router;
