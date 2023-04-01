const mongoose = require("mongoose");

const allData = new mongoose.Schema({
  bundleCourses: {
    type: Object,
  },
  coursesData: {
    type: Object,
  },
  instructorData: {
    type: Object,
  },
  courseData: {
    type: Array,
  },
},{ collection : 'allData' });

module.exports = mongoose.model("allData", allData);
