const mongoose = require("mongoose");

const lessonProgress = new mongoose.Schema({
  username: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  courseID: {
    type: String,
  },
  videoID: {
    type: String,
  },
  courseName: {
    type: String,
  },
  lessonNumber: {
    type: String,
  },
  totalPlayed: {
    type: Number,
  },
  totalCovered: {
    type: Number,
  },
  currentProgress: {
    type: Number,
  },
  complete: {
    type: Boolean,
  },
});

module.exports = mongoose.model("lessonProgress", lessonProgress);
