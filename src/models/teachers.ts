import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    id: String,
    udise: String,
    school: String,
    tname: String,
    desig: String,
    hoi: String,
    rank: Number,
    empid: String,
    gp: String,
    phone: String,
    email: String,
    pan: String,
    circle: String,
    spregistered: Boolean,
    dataYear: Number,
    convenor: String,
    gpAssistant: String,
    circleAssistant: String,
  },
  {
    timestamps: true,
  }
);

const Teacher =
  mongoose.models.teachers || mongoose.model("teachers", teacherSchema);

export default Teacher;
