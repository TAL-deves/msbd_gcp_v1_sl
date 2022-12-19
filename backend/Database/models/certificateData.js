const mongoose = require("mongoose");

const certificateData = new mongoose.Schema({
  username: {
    type: String,
  },
  fullName: {
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
  certificateID: {
    type: String,
  },
  certificateDate: {
    type: String
  }
});

module.exports = mongoose.model("certificateData", certificateData);
