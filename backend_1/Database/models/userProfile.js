const mongoose = require("mongoose");

const userProfile = new mongoose.Schema({
  fullname: {
    type: String,
  },
  age: {
    type: Number,
  },
  profession: {
    type: String,
  },
  profilephoto: {
    type: String,
  },
});

module.exports = mongoose.model("userProfile", userProfile);
