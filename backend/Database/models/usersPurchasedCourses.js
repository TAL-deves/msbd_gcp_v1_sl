const mongoose = require("mongoose");

const userPurchasedCourses = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    email: {
      type: String,
    },
    coursesList: {
      type: Array,
    },
    tran_date: {
      type: String,
    },
    bank_tran_id: {
      type: String,
    },
    tran_id: {
      type: String,
    },
    val_id: {
      type: String,
    },
    amount: {
      type: String,
    },
    status: {
      type: String,
    },
    dateOfPurchase: {
      type: Date,
      default: Date.now,
    },
    expirationDate: {
      type: String,
    },
  }
  //  { collection : 'logData' }
);

module.exports = mongoose.model("userPurchasedCourses", userPurchasedCourses);
