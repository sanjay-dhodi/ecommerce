const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cartItem: [],
  resetToken: String,
  resetTokenExpiry: String,
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
