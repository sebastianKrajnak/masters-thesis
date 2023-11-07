const { Schema, model } = require("mongoose");

const TableQueue = new Schema({
  _id: String,
  table: Array,
  queue: Array,
});

module.exports = model("TableQueue", TableQueue);
