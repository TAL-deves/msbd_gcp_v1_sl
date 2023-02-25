const mongoose = require("mongoose");

const userNotification = new mongoose.Schema({
  username:{
    type: String
  },
  notificationid:{
    type: Array
  },
  read:{
    type : Boolean
  }
});

module.exports = mongoose.model("userNotification", userNotification);
