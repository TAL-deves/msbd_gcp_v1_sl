const mongoose = require("mongoose");

const sliderData = new mongoose.Schema({
  imageLink: {
    type: String,
  },
  videoLink: {
    type: String,
  },
  lottieLink: {
    type: String,
  },
  date:{
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("sliderData", sliderData);
