const mongoose = require("mongoose");

const faqData = new mongoose.Schema({
  question: {
    type: String,
  },
  answer: {
    type: String,
  },
  language: {
    type: String,
  },
  date:{
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("faqData", faqData);
