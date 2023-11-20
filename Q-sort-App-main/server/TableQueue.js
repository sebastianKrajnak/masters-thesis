const { Schema, model } = require("mongoose");

const TableQueue = new Schema({
  _id: String,
  table: String,
  queue: String,
});

module.exports = model("TableQueue", TableQueue);
