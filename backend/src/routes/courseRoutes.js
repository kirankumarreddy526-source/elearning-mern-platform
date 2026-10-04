const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getCourseById,
  getCategories
} = require('../controllers/courseController');

router.get('/', getAllCourses);
router.get('/categories', getCategories);
router.get('/:id', getCourseById);

module.exports = router;
