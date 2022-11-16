const mongoose = require("mongoose");

const reviews = new mongoose.Schema({
  courseID: { type: String },
  username:{ type: String},
  review:{ type: String},
  reviewDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("review", reviews);