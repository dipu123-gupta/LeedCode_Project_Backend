const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
      trim: true,
    },
    secondName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      immutable: true,
    },
    age: {
      type: Number,
      max: 100,
      min: 10,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    password: {
      type: String,
      // maxLength: 20,
      minLength: 6,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    problemSolved: {
      type: [{
        type:Schema.Types.ObjectId,
        ref:"proble"
      }],
      unique:true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);
module.exports = User;
