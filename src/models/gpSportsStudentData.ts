import mongoose from "mongoose";

const gpSportsStudentDataSchema = new mongoose.Schema(
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

const gpSportsStudentData =
  mongoose.models.gpSportsStudentData ||
  mongoose.model(
    "gpSportsStudentData",
    gpSportsStudentDataSchema,
    "gpSportsStudentData"
  );

export default gpSportsStudentData;
