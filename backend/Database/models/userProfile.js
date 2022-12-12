const mongoose = require("mongoose");

const userProfile = new mongoose.Schema({
  username: {
    type: String,
  },
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
  gender: {
    type: String,
  },
  email: {
    type: String,
  },
  streetAddress: {
    type: String,
  },
  city: {
    type: String,
  },
  postCode: {
    type: String,
  },
  country: {
    type: String,
  }
});

module.exports = mongoose.model("userProfile", userProfile);
