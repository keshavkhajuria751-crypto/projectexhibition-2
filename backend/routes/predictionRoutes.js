const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/predict', authMiddleware, predictionController.predictPrice);

module.exports = router;
