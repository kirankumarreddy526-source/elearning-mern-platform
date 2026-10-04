const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Payment = require('../models/Payment');
const stripe = require('../config/stripe');

/**
 * @desc    Create Stripe Checkout Session for a paid course
 * @route   POST /api/payments/create-checkout-session
 * @access  Private (Student)
 */
const createCheckoutSession = async (req, res, next) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'This course is free. Please use free enrollment endpoint.'
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user._id,
      course: course._id
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course.'
      });
    }

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    // If Stripe is not configured or placeholder key is used, provide simulated checkout URL
    if (!stripe) {
      const mockSessionId = 'sim_cs_' + Date.now();
      return res.status(200).json({
        success: true,
        isSimulated: true,
        sessionId: mockSessionId,
        checkoutUrl: `${clientUrl}/payment/success?session_id=${mockSessionId}&course_id=${course._id}`
      });
    }

    // Real Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: course.title,
              description: course.subtitle || course.description.substring(0, 150),
              images: course.thumbnail ? [course.thumbnail] : []
            },
            unit_amount: Math.round(course.price * 100) // Stripe amounts in cents
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${clientUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}&course_id=${course._id}`,
      cancel_url: `${clientUrl}/payment/cancel?course_id=${course._id}`,
      customer_email: req.user.email,
      metadata: {
        studentId: req.user._id.toString(),
        courseId: course._id.toString()
      }
    });

    res.status(200).json({
      success: true,
      sessionId: session.id,
      checkoutUrl: session.url
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Verify Stripe payment & finalize student enrollment
 * @route   POST /api/payments/verify
 * @access  Private (Student)
 */
const verifyPaymentAndEnroll = async (req, res, next) => {
  try {
    const { sessionId, courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if already enrolled
    let enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: course._id
    });

    if (enrollment) {
      return res.status(200).json({
        success: true,
        message: 'Already enrolled in course',
        enrollment
      });
    }

    // Record Payment
    const payment = await Payment.create({
      student: req.user._id,
      course: course._id,
      stripeSessionId: sessionId || 'simulated_session',
      amount: course.price,
      currency: 'usd',
      status: 'completed'
    });

    // Create Enrollment
    enrollment = await Enrollment.create({
      student: req.user._id,
      course: course._id,
      completedLessons: [],
      progressPercentage: 0,
      payment: payment._id
    });

    // Increment course enrolled counter
    course.enrolledCount = (course.enrolledCount || 0) + 1;
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Payment verified and enrolled successfully!',
      enrollment
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Handle Stripe Webhook for asynchronous payment fulfillment
 * @route   POST /api/payments/webhook
 * @access  Public
 */
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
      return res.status(200).json({ received: true });
    }

    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`[Stripe Webhook Error]: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { studentId, courseId } = session.metadata || {};

    if (studentId && courseId) {
      try {
        const existing = await Enrollment.findOne({ student: studentId, course: courseId });
        if (!existing) {
          const payment = await Payment.create({
            student: studentId,
            course: courseId,
            stripeSessionId: session.id,
            stripePaymentIntentId: session.payment_intent || '',
            amount: (session.amount_total || 0) / 100,
            currency: session.currency || 'usd',
            status: 'completed'
          });

          await Enrollment.create({
            student: studentId,
            course: courseId,
            completedLessons: [],
            progressPercentage: 0,
            payment: payment._id
          });

          await Course.findByIdAndUpdate(courseId, { $inc: { enrolledCount: 1 } });
        }
      } catch (err) {
        console.error('Error handling checkout.session.completed:', err.message);
      }
    }
  }

  res.status(200).json({ received: true });
};

module.exports = {
  createCheckoutSession,
  verifyPaymentAndEnroll,
  handleStripeWebhook
};
