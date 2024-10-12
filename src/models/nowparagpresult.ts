import mongoose from "mongoose";

const nowparagpresultSchema = new mongoose.Schema(
  {
    sclass: String,
    event2rank: Number,
    event1: String,
    name: String,
    school: String,
    studentId: String,
    gp: String,
    event2: String,
    position1: String,
    position2: String,
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

const nowparagpresult =
  mongoose.models.nowparagpresult ||
  mongoose.model("nowparagpresult", nowparagpresultSchema, "nowparagpresult");

export default nowparagpresult;
