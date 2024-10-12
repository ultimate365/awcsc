import mongoose from "mongoose";

const gazipurgpresultSchema = new mongoose.Schema(
  {
    sclass: String,
    event2rank: Number,
    event1: String,
    name: String,
    school: String,
    studentId: String,
    gp: String,
    position1: String,
    position2: String,
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

const gazipurgpresult =
  mongoose.models.gazipurgpresult ||
  mongoose.model("gazipurgpresult", gazipurgpresultSchema, "gazipurgpresult");

export default gazipurgpresult;
