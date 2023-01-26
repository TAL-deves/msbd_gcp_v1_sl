const mongoose = require("mongoose");

const subscribers = new mongoose.Schema({
  email: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  date: {
    type: String
  }
});

module.exports = mongoose.model("subscribers", subscribers);
