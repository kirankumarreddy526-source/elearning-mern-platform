const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Please add a lesson title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    description: {
      type: String,
      default: ''
    },
    order: {
      type: Number,
      default: 1
    },
    duration: {
      type: String,
      default: '10 min'
    },
    videoUrl: {
      type: String,
      default: ''
    },
    pdfUrl: {
      type: String,
      default: ''
    },
    isFreePreview: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Lesson', LessonSchema);
