const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a course title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: [200, 'Subtitle cannot exceed 200 characters'],
      default: ''
    },
    description: {
      type: String,
      required: [true, 'Please add a course description']
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      enum: [
        'Web Development',
        'Mobile Development',
        'Data Science & AI',
        'Cloud & DevOps',
        'UI/UX Design',
        'Cybersecurity',
        'Business & Tech'
      ],
      default: 'Web Development'
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'Beginner'
    },
    price: {
      type: Number,
      required: [true, 'Please specify price (0 for free)'],
      default: 0,
      min: [0, 'Price must be 0 or higher']
    },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'
    },
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    lessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson'
      }
    ],
    isPublished: {
      type: Boolean,
      default: true
    },
    enrolledCount: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 4.8,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    reviewsCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Virtual for total lessons count
CourseSchema.virtual('totalLessons').get(function () {
  return this.lessons ? this.lessons.length : 0;
});

module.exports = mongoose.model('Course', CourseSchema);
