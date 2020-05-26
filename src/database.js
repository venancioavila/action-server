var mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.DB, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

mongoose.Promise = global.Promise;

module.exports = mongoose;
