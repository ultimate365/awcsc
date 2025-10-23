import mongoose from "mongoose";

let otpSchema = new mongoose.Schema(
  {
    email: String,
    code: Number,
    expiresIn: Number,
  },
  {
    timestamps: true,
  }
);

const EmailOtp =
  mongoose.models.emailotp || mongoose.model("emailotp", otpSchema, "emailotp");

export default EmailOtp;
