const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    firstName: { type: String },
    lastName: { type: String },
    mobile: { type: String },
    photo: { type: String },
    password: { type: String },
  },
  { timeStamp: true }
);

const User = model("User", userSchema);
module.exports = User;
