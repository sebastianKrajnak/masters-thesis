const { Schema, model } = require("mongoose");

const qData = new Schema({
  _id: String,
  data: String,
});

module.exports = model("qData", qData);
