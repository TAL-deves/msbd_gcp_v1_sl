const mongoose = require("mongoose");

const extraData = new mongoose.Schema({
  redirectionLink: {
    type: String,
  },
  welcomeMessage: {
    type: String,
  },
  welcomeMessageActive: {
    type: Boolean,
  },
});

module.exports = mongoose.model("extraData", extraData);
