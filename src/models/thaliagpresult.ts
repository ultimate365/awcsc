import mongoose from "mongoose";

const thaliagpresultSchema = new mongoose.Schema(
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

const thaliagpresult =
  mongoose.models.thaliagpresult ||
  mongoose.model("thaliagpresult", thaliagpresultSchema, "thaliagpresult");

export default thaliagpresult;
