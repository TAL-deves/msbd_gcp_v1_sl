const mongoose = require("mongoose");

const notificationMessages = new mongoose.Schema({
  title: {
    type: String,
  },
  body: {
    type: String,
  },
  imageLink: {
    type: String,
  },
  videoLink: {
    type: String,
  },
  dataTitle: {
    type: String,
  },
  dataBody: {
    type: String,
  },
  dataImageLink: {
    type: String,
  },
  dataVideoLink: {
    type: String,
  },
  sentTo:{
    type:String
  },
  priority:{
    type:String
  }
});

module.exports = mongoose.model("notificationMessages", notificationMessages);
