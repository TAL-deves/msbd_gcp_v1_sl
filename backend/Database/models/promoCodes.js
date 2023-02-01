const mongoose = require("mongoose");

const promoCodes = new mongoose.Schema({
  code: {
    type: String,
  },
  discount: {
    type: String,
  },
  amount: {
    type: Number,
  },
  active: {
    type: Boolean,
  },
});

module.exports = mongoose.model("promoCodes", promoCodes);
