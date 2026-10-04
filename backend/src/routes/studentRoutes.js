const express = require('express');
const router = express.Router();
const {
  getMyEnrollments,
  enrollFreeCourse,
  getCourseLearningRoom,
  toggleLessonProgress
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/enrollments', getMyEnrollments);
router.post('/courses/:courseId/enroll-free', enrollFreeCourse);
router.get('/courses/:courseId/learn', getCourseLearningRoom);
router.post('/courses/:courseId/lessons/:lessonId/progress', toggleLessonProgress);

module.exports = router;
