const mongoose = require("../database");

var CodeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date(),
  },
});

const Code = mongoose.model("Code", CodeSchema);

module.exports = Code;
