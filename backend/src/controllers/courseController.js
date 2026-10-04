const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');

/**
 * @desc    Get all published courses with search & filter
 * @route   GET /api/courses
 * @access  Public
 */
const getAllCourses = async (req, res, next) => {
  try {
    const { search, category, level, priceType, sort } = req.query;

    const query = { isPublished: true };

    // Search keyword in title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { subtitle: { $regex: search, $options: 'i' } }
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Level filter
    if (level && level !== 'All') {
      query.level = level;
    }

    // Free vs Paid filter
    if (priceType === 'free') {
      query.price = 0;
    } else if (priceType === 'paid') {
      query.price = { $gt: 0 };
    }

    // Sorting options
    let sortOption = { createdAt: -1 }; // newest by default
    if (sort === 'price-low') sortOption = { price: 1 };
    else if (sort === 'price-high') sortOption = { price: -1 };
    else if (sort === 'popular') sortOption = { enrolledCount: -1 };
    else if (sort === 'rating') sortOption = { averageRating: -1 };

    const courses = await Course.find(query)
      .populate('tutor', 'name avatar bio')
      .populate('lessons', 'title duration isFreePreview order')
      .sort(sortOption);

    res.status(200).json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single course details
 * @route   GET /api/courses/:id
 * @access  Public
 */
const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('tutor', 'name email avatar bio')
      .populate({
        path: 'lessons',
        options: { sort: { order: 1 } },
        select: 'title description duration isFreePreview order videoUrl pdfUrl'
      });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      course
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get available categories
 * @route   GET /api/courses/categories
 * @access  Public
 */
const getCategories = async (req, res, next) => {
  try {
    const categories = [
      'Web Development',
      'Mobile Development',
      'Data Science & AI',
      'Cloud & DevOps',
      'UI/UX Design',
      'Cybersecurity',
      'Business & Tech'
    ];

    res.status(200).json({
      success: true,
      categories
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  getCategories
};
