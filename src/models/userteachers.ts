import mongoose from "mongoose";

const userteachersSchema = new mongoose.Schema(
  {
    disabled: Boolean,
    createdAt: String,
    tname: String,
    email: String,
    circle: String,
    circleAssistant: String,
    password: String,
    username: String,
    udise: String,
    pan: String,
    desig: String,
    convenor: String,
    school: String,
    empid: String,
    teachersID: String,
    id: String,
    phone: String,
    gpAssistant: String,
    gp: String,
  },
  {
    timestamps: true,
  }
);

const userteachers =
  mongoose.models.userteachers ||
  mongoose.model("userteachers", userteachersSchema);

export default userteachers;
