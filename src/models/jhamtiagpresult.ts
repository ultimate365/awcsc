import mongoose from "mongoose";

const jhamtiagpresultSchema = new mongoose.Schema(
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

const jhamtiagpresult =
  mongoose.models.jhamtiagpresult ||
  mongoose.model("jhamtiagpresult", jhamtiagpresultSchema, "jhamtiagpresult");

export default jhamtiagpresult;
