const mongoose = require("mongoose");

const promoCodes = new mongoose.Schema({
  code: {
    type: String,
  },
  validity: {
    type: Number,
  },
  activeStatus: {
    type: Boolean,
  }
});

module.exports = mongoose.model("promoCodes", promoCodes);
