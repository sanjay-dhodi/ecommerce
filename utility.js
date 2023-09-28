require("dotenv").config();

// datbase connection
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGOURL).then(console.log("database connection successfull"));
