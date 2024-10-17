import mongoose from "mongoose";

let phoneOtpSchema = new mongoose.Schema(
  {
    phone: String,
    code: String,
    expiresIn: Number,
  },
  {
    timestamps: true,
  }
);

const PhoneOtp =
  mongoose.models.phoneotp ||
  mongoose.model("phoneotp", phoneOtpSchema, "phoneotp");

export default PhoneOtp;
