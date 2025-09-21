import mongoose from "mongoose";

const allGPAssistantsSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

const allGPAssistants =
  mongoose.models.allGPAssistants ||
  mongoose.model("allGPAssistants", allGPAssistantsSchema, "allGPAssistants");

export default allGPAssistants;
