const mongoose = require("mongoose");

const videoLogData = new mongoose.Schema({
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
  lessonName: {
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
  status: {
    type: String,
  },
  actionTime: {
    type: Number,
  },
}, {collection:"videoLogData"});

module.exports = mongoose.model("videoLogData", videoLogData);
