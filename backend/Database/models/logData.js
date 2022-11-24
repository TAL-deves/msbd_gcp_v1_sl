const mongoose = require("mongoose");

const logData = new mongoose.Schema({
  
}, { collection : 'logData' });

module.exports = mongoose.model("logData", logData);