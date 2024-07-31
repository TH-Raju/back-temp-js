/** @format */

import mongoose, { model } from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Minimum password length is 6 characters"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "super_admin"],
      default: "user",
    },
    photo: {
      type: String,
      default: "/uploads/profile/default-user.jpg",
    },
    gender: {
      type: String,
    },
    dob: {
      type: String,
    },
    address: {
      type: String,
    },
    location: {
      type: String,
    },
    about: {
      type: String,
    },
    isOnline: {
      type: String,
      default: 0,
    },
    isDelete: {
      type: String,
      default: "no",
    },
    isOnline: {
      type: String,
      default: "0",
    },
    isBlock: {
      type: String,
      default: "no",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.pre("find", function () {
  this.where({ isDelete: { $ne: "yes" } });
});

userSchema.pre("findOne", function () {
  this.where({ isDelete: { $ne: "yes" } });
});

userSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: "yes" } } });
  next();
});

export const User = model("User", userSchema);
export default model("User", userSchema);
