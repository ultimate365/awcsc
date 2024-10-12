import mongoose from "mongoose";

const bkbatigpresultSchema = new mongoose.Schema(
  {
    sclass: String,
    event2rank: Number,
    event1: String,
    name: String,
    school: String,
    studentId: String,
    position1: String,
    position2: String,
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

const bkbatigpresult =
  mongoose.models.bkbatigpresult ||
  mongoose.model("bkbatigpresult", bkbatigpresultSchema, "bkbatigpresult");

export default bkbatigpresult;
