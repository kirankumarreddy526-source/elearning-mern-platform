const express = require('express');
const router = express.Router();
const {
  createCheckoutSession,
  verifyPaymentAndEnroll,
  handleStripeWebhook
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-checkout-session', protect, createCheckoutSession);
router.post('/verify', protect, verifyPaymentAndEnroll);
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

module.exports = router;
