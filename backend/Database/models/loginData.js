const mongoose = require("mongoose");

const loginData = new mongoose.Schema({
  
},
//  { collection : 'logData' }
 );

module.exports = mongoose.model("loginData", loginData);