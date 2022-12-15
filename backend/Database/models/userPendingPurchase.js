const mongoose = require("mongoose");

const userPendingPurchase = new mongoose.Schema(
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
    card_brand: {
      type: String,
    },
    card_issuer: {
      type: String,
    },
    card_issuer_country: {
      type: String,
    },
    card_no: {
      type: String,
    },
    card_sub_brand: {
      type: String,
    },
    card_type: {
      type: String,
    },
    currency: {
      type: String,
    },
    currency_amount: {
      type: String,
    },
    currency_rate: {
      type: String,
    },
    currency_type: {
      type: String,
    },
    error: {
      type: String,
    },
    risk_level: {
      type: String,
    },
    store_amount: {
      type: String,
    },
    store_id: {
      type: String,
    },
    value_a: {
      type: String,
    },
    value_b: {
      type: String,
    },
    value_c: {
      type: String,
    },
    value_d: {
      type: String,
    },
    verify_sign: {
      type: String,
    },
    verify_sign_sha2: {
      type: String,
    },
    verify_key: {
      type: String,
    },
    expirationDate: {
      type: String,
    }
  }
  //  { collection : 'logData' }
);

module.exports = mongoose.model("userPendingPurchase", userPendingPurchase);
