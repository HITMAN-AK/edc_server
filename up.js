const mongoose = require("mongoose");
const { Schema } = mongoose;
const userpass = new Schema({
  uuid: String,
  username: String,
  password: String,
  id: Number,
  time: { type: String, default: "00:00" },
  image: String,
});
module.exports = mongoose.model("Up", userpass);
