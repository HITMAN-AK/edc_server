const mongoose = require("mongoose");
const { Schema } = mongoose;
const staffSchema = new Schema({
  name: String,
  user_id: String,
  status: String,
  workingtime: String,
});
const departmentSchema = new Schema({
  name: String,
  staff: [staffSchema],
});
const collegeSchema = new Schema({
  name: String,
  departments: [departmentSchema],
});
module.exports = mongoose.model("user", collegeSchema);
