const express = require('express');
const router = express.Router();
const {
  getPlatformStats,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllCoursesAdmin,
  deleteCourseAdmin
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All admin routes are protected and require 'admin' role
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getPlatformStats);
router.get('/users', getAllUsers);
router.route('/users/:id')
  .put(updateUser)
  .delete(deleteUser);

router.get('/courses', getAllCoursesAdmin);
router.delete('/courses/:id', deleteCourseAdmin);

module.exports = router;
