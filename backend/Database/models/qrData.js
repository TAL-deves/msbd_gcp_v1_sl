const mongoose = require("mongoose");

const qrData = new mongoose.Schema({
  qrid: { type: String },
  username:{ type: String},
  date: {
    type: String
  }
});

module.exports = mongoose.model("qrData", qrData);