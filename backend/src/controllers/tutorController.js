const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');
const Payment = require('../models/Payment');
const { uploadToCloudinary } = require('../config/cloudinary');

/**
 * @desc    Upload media (video, pdf, image) to Cloudinary
 * @route   POST /api/tutor/upload
 * @access  Private (Tutor)
 */
const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded.'
      });
    }

    const { type } = req.body; // 'video', 'pdf', or 'thumbnail'
    let resourceType = 'auto';
    let folder = 'elearning_materials';

    if (type === 'video') {
      resourceType = 'video';
      folder = 'elearning_videos';
    } else if (type === 'pdf') {
      resourceType = 'raw';
      folder = 'elearning_docs';
    } else if (type === 'thumbnail') {
      resourceType = 'image';
      folder = 'elearning_thumbnails';
    }

    const uploadResult = await uploadToCloudinary(req.file.buffer, folder, resourceType);

    res.status(200).json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      format: uploadResult.format || 'unknown'
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new course
 * @route   POST /api/tutor/courses
 * @access  Private (Tutor)
 */
const createCourse = async (req, res, next) => {
  try {
    const { title, subtitle, description, category, level, price, thumbnail } = req.body;

    if (!title || !description || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and price are required.'
      });
    }

    const course = await Course.create({
      title,
      subtitle: subtitle || '',
      description,
      category: category || 'Web Development',
      level: level || 'Beginner',
      price: Number(price) || 0,
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
      tutor: req.user._id,
      lessons: []
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all courses created by logged-in tutor
 * @route   GET /api/tutor/courses
 * @access  Private (Tutor)
 */
const getTutorCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ tutor: req.user._id })
      .populate('lessons')
      .sort({ createdAt: -1 });

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
 * @desc    Update course details
 * @route   PUT /api/tutor/courses/:id
 * @access  Private (Tutor)
 */
const updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Ensure logged-in user is course owner
    if (course.tutor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course'
      });
    }

    const { title, subtitle, description, category, level, price, thumbnail, isPublished } = req.body;

    course = await Course.findByIdAndUpdate(
      req.params.id,
      {
        ...(title && { title }),
        ...(subtitle !== undefined && { subtitle }),
        ...(description && { description }),
        ...(category && { category }),
        ...(level && { level }),
        ...(price !== undefined && { price: Number(price) }),
        ...(thumbnail && { thumbnail }),
        ...(isPublished !== undefined && { isPublished })
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      course
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete a course
 * @route   DELETE /api/tutor/courses/:id
 * @access  Private (Tutor)
 */
const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.tutor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course'
      });
    }

    // Remove associated lessons
    await Lesson.deleteMany({ course: course._id });
    // Remove enrollments
    await Enrollment.deleteMany({ course: course._id });
    // Remove course
    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Course and associated materials removed'
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Add lesson to course (with video & PDF links)
 * @route   POST /api/tutor/courses/:courseId/lessons
 * @access  Private (Tutor)
 */
const addLesson = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.tutor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add lessons to this course'
      });
    }

    const { title, description, duration, videoUrl, pdfUrl, isFreePreview } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Lesson title is required'
      });
    }

    const lessonCount = await Lesson.countDocuments({ course: courseId });

    const lesson = await Lesson.create({
      course: courseId,
      title,
      description: description || '',
      duration: duration || '10 min',
      videoUrl: videoUrl || '',
      pdfUrl: pdfUrl || '',
      isFreePreview: !!isFreePreview,
      order: lessonCount + 1
    });

    course.lessons.push(lesson._id);
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Lesson added successfully',
      lesson
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete a lesson from course
 * @route   DELETE /api/tutor/courses/:courseId/lessons/:lessonId
 * @access  Private (Tutor)
 */
const deleteLesson = async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.tutor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete lessons from this course'
      });
    }

    await Lesson.findByIdAndDelete(lessonId);

    // Remove from course.lessons array
    course.lessons = course.lessons.filter((id) => id.toString() !== lessonId);
    await course.save();

    res.status(200).json({
      success: true,
      message: 'Lesson removed successfully'
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get tutor analytics (enrolled students, revenue)
 * @route   GET /api/tutor/stats
 * @access  Private (Tutor)
 */
const getTutorStats = async (req, res, next) => {
  try {
    const courses = await Course.find({ tutor: req.user._id });
    const courseIds = courses.map((c) => c._id);

    const enrollmentsCount = await Enrollment.countDocuments({
      course: { $in: courseIds }
    });

    const payments = await Payment.find({
      course: { $in: courseIds },
      status: 'completed'
    });

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    res.status(200).json({
      success: true,
      stats: {
        totalCourses: courses.length,
        totalStudents: enrollmentsCount,
        totalRevenue: Math.round(totalRevenue * 100) / 100
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  uploadMedia,
  createCourse,
  getTutorCourses,
  updateCourse,
  deleteCourse,
  addLesson,
  deleteLesson,
  getTutorStats
};
