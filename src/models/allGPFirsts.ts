import mongoose from "mongoose";

const allGPFirstsSchema = new mongoose.Schema(
  {
    sclass: String,
    event2rank: Number,
    event1: String,
    name: String,
    school: String,
    studentId: String,
    gp: String,
    event2: String,
    group: String,
    id: String,
    udise: String,
    gender: String,
    birthday: String,
    gurdiansName: String,
    event1rank: Number,
    chestNo: Number,
  },
  {
    timestamps: true,
  }
);

const allGPFirsts =
  mongoose.models.allGPFirsts ||
  mongoose.model("allGPFirsts", allGPFirstsSchema, "allGPFirsts");

export default allGPFirsts;
