const mongoose = require("mongoose");

const courseProgress = new mongoose.Schema({
  username: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  courseID: {
    type: String,
  },
  courseName: {
    type: String,
  },
  totalLessonCompleted: {
    type: String,
  },
  currentProgress: {
    type: Number,
  },
  completeStatus: {
    type: Boolean,
  },
  certificate: {
    type: Boolean,
  },
});

module.exports = mongoose.model("courseProgress", courseProgress);
