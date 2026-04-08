const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/predict', authMiddleware, predictionController.predictPrice);
router.post('/track',   authMiddleware, predictionController.trackPrice);

module.exports = router;
