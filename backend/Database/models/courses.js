const mongoose = require("mongoose");

const courseIdList = new mongoose.Schema({
  _id: { type: String },
  courseName: { type: String },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("courseIdList", courseIdList);
