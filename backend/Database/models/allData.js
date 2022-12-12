const mongoose = require("mongoose");

const allData = new mongoose.Schema({
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
