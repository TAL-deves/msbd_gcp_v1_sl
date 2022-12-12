const mongoose = require("mongoose");

const testdbdata = new mongoose.Schema({
  testdata1: {
    type: Object,
  },
  testdata2: {
    type: String,
  }
});

module.exports = mongoose.model("testdbdata", testdbdata);
