const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');

/**
 * @desc    Get all courses enrolled by logged-in student
 * @route   GET /api/student/enrollments
 * @access  Private (Student)
 */
const getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
        path: 'course',
        populate: { path: 'tutor', select: 'name avatar' }
      })
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Direct enrollment for free ($0) course
 * @route   POST /api/student/courses/:courseId/enroll-free
 * @access  Private (Student)
 */
const enrollFreeCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.price > 0) {
      return res.status(400).json({
        success: false,
        message: 'This is a paid course. Payment via Stripe is required.'
      });
    }

    let enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: course._id
    });

    if (enrollment) {
      return res.status(200).json({
        success: true,
        message: 'Already enrolled in this course',
        enrollment
      });
    }

    enrollment = await Enrollment.create({
      student: req.user._id,
      course: course._id,
      completedLessons: [],
      progressPercentage: 0
    });

    // Increment course enrolled counter
    course.enrolledCount = (course.enrolledCount || 0) + 1;
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course',
      enrollment
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get learning room data (lessons, video links, pdf links, progress)
 * @route   GET /api/student/courses/:courseId/learn
 * @access  Private
 */
const getCourseLearningRoom = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId)
      .populate('tutor', 'name email avatar bio')
      .populate({
        path: 'lessons',
        options: { sort: { order: 1 } }
      });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check enrollment
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId
    });

    const isTutorOwner = course.tutor._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    // If not enrolled, and not tutor owner, and not admin
    if (!enrollment && !isTutorOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not enrolled in this course.'
      });
    }

    res.status(200).json({
      success: true,
      course,
      enrollment: enrollment || {
        completedLessons: [],
        progressPercentage: 0,
        isCompleted: false
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Toggle lesson completion & recalculate student progress
 * @route   POST /api/student/courses/:courseId/lessons/:lessonId/progress
 * @access  Private (Student)
 */
const toggleLessonProgress = async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    let enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'Enrollment record not found for this course'
      });
    }

    const lessonExists = course.lessons.some((lId) => lId.toString() === lessonId);
    if (!lessonExists) {
      return res.status(400).json({
        success: false,
        message: 'Lesson does not belong to this course'
      });
    }

    const completedSet = new Set(enrollment.completedLessons.map((id) => id.toString()));

    if (completedSet.has(lessonId)) {
      completedSet.delete(lessonId);
    } else {
      completedSet.add(lessonId);
    }

    enrollment.completedLessons = Array.from(completedSet);

    // Calculate progress percentage
    const totalLessons = course.lessons.length;
    const completedCount = enrollment.completedLessons.length;
    enrollment.progressPercentage =
      totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    enrollment.isCompleted = enrollment.progressPercentage === 100;
    if (enrollment.isCompleted && !enrollment.completedAt) {
      enrollment.completedAt = new Date();
    }

    enrollment.lastAccessedLesson = lessonId;
    await enrollment.save();

    res.status(200).json({
      success: true,
      message: 'Progress updated',
      progressPercentage: enrollment.progressPercentage,
      isCompleted: enrollment.isCompleted,
      completedLessons: enrollment.completedLessons
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMyEnrollments,
  enrollFreeCourse,
  getCourseLearningRoom,
  toggleLessonProgress
};
