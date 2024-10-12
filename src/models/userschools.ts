import mongoose from "mongoose";

const userschoolSchema = new mongoose.Schema(
  {
    id: String,
    school: String,
    udise: String,
    username: String,
    gp: String,
    year: String,
    hoi: String,
    convenor: String,
    password: String,
  },
  {
    timestamps: true,
  }
);

const userschool =
  mongoose.models.userschools ||
  mongoose.model("userschools", userschoolSchema);

export default userschool;
