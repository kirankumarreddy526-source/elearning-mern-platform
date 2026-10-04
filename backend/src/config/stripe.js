const Stripe = require('stripe');

let stripeInstance = null;

if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('placeholder')) {
  try {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16'
    });
  } catch (err) {
    console.warn('[Stripe Warning]: Could not initialize Stripe client:', err.message);
  }
}

module.exports = stripeInstance;
