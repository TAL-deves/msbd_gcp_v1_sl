const mongoose = require("mongoose");

const userMessages = new mongoose.Schema({
    phonenumber: {
    type: String,
  },
  email: {
    type: String,
  },
  fullname: {
    type: String,
  },
  leaveMessage: {
    type: String,
  }
});

module.exports = mongoose.model("userMessages", userMessages);
