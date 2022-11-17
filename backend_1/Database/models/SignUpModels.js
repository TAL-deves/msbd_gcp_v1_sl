const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const signUpTemplate = new mongoose.Schema({
  fullname: {
    type: String,
  },
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  password: {
    type: String,
  },
  googleId: {
    type: String,
  },
  facebookId: {
    type: String,
  },
  profilename: {
    type: String,
  },
  profession: {
    type: String,
  },
  age: {
    type: String,
  },
  profilephoto: {
    type: String,
  },
  otp: {
    type: String,
  },
  otpGeneratedAt: {
    type: Date,
    default: Date.now,
  },
  otpExpired: {
    type: Boolean,
    default: false,
  },
  otplifetime: {
    type: Number,
    default: 180000,
  },
  otpretrycount: {
    type: Number,
    default: 3,
  },
  resetotpcount: {
    type: Number,
    default: 3,
  },
  active: {
    type: Boolean,
    default: false,
  },
  locked: {
    type: Boolean,
    default: false,
  },
  purchasedCourses: {
    type: Array,
    default: []
  },
  loggedinID: {
    type: String,
    default: null
  },
  creation_date: {
    type: Date,
    default: Date.now,
  },
});

signUpTemplate.pre('save', async function (next) {
  if(this.isModified('password')){
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
})



module.exports = mongoose.model("userData", signUpTemplate);



