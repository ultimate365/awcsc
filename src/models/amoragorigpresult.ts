import mongoose from "mongoose";

const amoragorigpresultSchema = new mongoose.Schema(
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
    position1: String,
    position2: String,
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

const amoragorigpresult =
  mongoose.models.amoragorigpresult ||
  mongoose.model(
    "amoragorigpresult",
    amoragorigpresultSchema,
    "amoragorigpresult"
  );

export default amoragorigpresult;
