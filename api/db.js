let mongoose = require("mongoose");
let { MONGODB_CONNECTION_STRING } = require("./config");

const url = MONGODB_CONNECTION_STRING

mongoose.connect(url);

mongoose.connection.on("connected", function() {
  console.log("Mongoose connected to " + url);
});