import mongoose from "mongoose";

const gpLockDataSchema = new mongoose.Schema(
  {
    closeDate: Number,
    edit: Boolean,
    entryCloseddBy: String,
    entryDate: Number,
    entryStaredBy: String,
    gp: String,
    id: String,
  },
  {
    timestamps: true,
  }
);

const gpLockData =
  mongoose.models.gpLockData ||
  mongoose.model("gpLockData", gpLockDataSchema, "gpLockData");

export default gpLockData;
