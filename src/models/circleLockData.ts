import mongoose from "mongoose";

const circleLockDataSchema = new mongoose.Schema(
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

const circleLockData =
  mongoose.models.circleLockData ||
  mongoose.model("circleLockData", circleLockDataSchema, "circleLockData");

export default circleLockData;
