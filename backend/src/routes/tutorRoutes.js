const express = require('express');
const router = express.Router();
const {
  uploadMedia,
  createCourse,
  getTutorCourses,
  updateCourse,
  deleteCourse,
  addLesson,
  deleteLesson,
  getTutorStats
} = require('../controllers/tutorController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// All tutor routes require authentication and tutor/admin role
router.use(protect);
router.use(authorize('tutor', 'admin'));

router.get('/stats', getTutorStats);
router.post('/upload', upload.single('file'), uploadMedia);

router.route('/courses')
  .get(getTutorCourses)
  .post(createCourse);

router.route('/courses/:id')
  .put(updateCourse)
  .delete(deleteCourse);

router.post('/courses/:courseId/lessons', addLesson);
router.delete('/courses/:courseId/lessons/:lessonId', deleteLesson);

module.exports = router;
