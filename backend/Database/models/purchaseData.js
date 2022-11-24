const mongoose = require("mongoose");

const purchaseData = new mongoose.Schema({
  
},
//  { collection : 'logData' }
 );

module.exports = mongoose.model("purchaseData", purchaseData);