const express = require('express');
const router = express.Router();
const { handleChat, getHistory, clearHistory } = require('../controllers/aiController');
const { authenticate, optionalAuth } = require('../middleware/authMiddleware');
const { aiLimiter } = require('../middleware/rateLimiter');

router.post('/chat', aiLimiter, optionalAuth, handleChat);
router.get('/history', authenticate, getHistory);
router.delete('/history', authenticate, clearHistory);

module.exports = router;
