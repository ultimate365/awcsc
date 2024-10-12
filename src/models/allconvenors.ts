import mongoose from "mongoose";

const allconvenorsSchema = new mongoose.Schema(
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
    registered: Boolean,
    dataYear: Number,
    convenor: String,
    gpAssistant: String,
  },
  {
    timestamps: true,
  }
);

const allconvenors =
  mongoose.models.allconvenors ||
  mongoose.model("allconvenors", allconvenorsSchema);

export default allconvenors;
