const mongoose = require("mongoose");
const { MONGODB_CONNECTION_STRING } = require("./config");

const url = MONGODB_CONNECTION_STRING;

// Workaround to deprecation warnings at https://mongoosejs.com/docs/deprecations.html
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
};

mongoose.connect(url, options);

mongoose.connection.on("connected", function () {
    console.log(`Mongoose connected to ${url}`);
});
