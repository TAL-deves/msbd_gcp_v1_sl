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
  },
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expires: 86400 }
  }
});

module.exports = mongoose.model("userNotification", userNotification);
