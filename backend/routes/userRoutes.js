const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/history', authMiddleware, userController.getSearchHistory);
router.put('/profile', authMiddleware, userController.updateProfile);
router.delete('/history', authMiddleware, userController.clearHistory);

module.exports = router;
