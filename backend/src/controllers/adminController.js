const User = require('../models/User');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');
const Payment = require('../models/Payment');

/**
 * @desc    Get overall platform analytics & KPIs
 * @route   GET /api/admin/stats
 * @access  Private (Admin)
 */
const getPlatformStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalTutors = await User.countDocuments({ role: 'tutor' });
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();

    const completedPayments = await Payment.find({ status: 'completed' });
    const totalRevenue = completedPayments.reduce((acc, curr) => acc + curr.amount, 0);

    const recentUsers = await User.find()
      .select('name email role status createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentPayments = await Payment.find()
      .populate('student', 'name email')
      .populate('course', 'title price')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalStudents,
        totalTutors,
        totalCourses,
        totalEnrollments,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        recentUsers,
        recentPayments
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all users with filtering
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;
    const query = {};

    if (role && role !== 'All') {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update user role or status (active/suspended)
 * @route   PUT /api/admin/users/:id
 * @access  Private (Admin)
 */
const updateUser = async (req, res, next) => {
  try {
    const { role, status } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (role && ['student', 'tutor', 'admin'].includes(role)) {
      user.role = role;
    }

    if (status && ['active', 'suspended'].includes(status)) {
      user.status = status;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin)
 */
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent deleting self
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own admin account'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all courses for administration
 * @route   GET /api/admin/courses
 * @access  Private (Admin)
 */
const getAllCoursesAdmin = async (req, res, next) => {
  try {
    const courses = await Course.find()
      .populate('tutor', 'name email avatar')
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
 * @desc    Admin delete course
 * @route   DELETE /api/admin/courses/:id
 * @access  Private (Admin)
 */
const deleteCourseAdmin = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    await Lesson.deleteMany({ course: course._id });
    await Enrollment.deleteMany({ course: course._id });
    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Course and related data removed by admin'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPlatformStats,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllCoursesAdmin,
  deleteCourseAdmin
};
