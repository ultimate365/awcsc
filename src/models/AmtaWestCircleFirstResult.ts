import mongoose from "mongoose";

const AmtaWestCircleFirstResultSchema = new mongoose.Schema(
  {
    sclass: String,
    event2rank: Number,
    event1: String,
    position: String,
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

const AmtaWestCircleFirstResult =
  mongoose.models.AmtaWestCircleFirstResult ||
  mongoose.model(
    "AmtaWestCircleFirstResult",
    AmtaWestCircleFirstResultSchema,
    "AmtaWestCircleFirstResult"
  );

export default AmtaWestCircleFirstResult;
