import dbConnect from "../../../lib/dbConnect";
import userteachers from "../../../models/userteachers";
import teachers from "../../../models/teachers";
import { NextRequest, NextResponse } from "next/server";

dbConnect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const {
      disabled,
      createdAt,
      tname,
      email,
      circle,
      circleAssistant,
      password,
      username,
      udise,
      pan,
      desig,
      convenor,
      school,
      empid,
      teachersID,
      id,
      phone,
      gpAssistant,
      gp,
    }: any = reqBody;
    const teacherData = await teachers.findOne({ empid });
    if (teacherData) {
      const userData = await userteachers.findOne({ empid });
      if (userData) {
        userData.tname = tname;
        userData.email = email;
        userData.circle = circle;
        userData.circleAssistant = circleAssistant;
        userData.password = password;
        userData.username = username;
        userData.udise = udise;
        userData.pan = pan;
        userData.desig = desig;
        userData.convenor = convenor;
        userData.school = school;
        userData.empid = empid;
        userData.teachersID = teachersID;
        userData.id = id;
        userData.phone = phone;
        userData.gpAssistant = gpAssistant;
        userData.gp = gp;
        userData.disabled = disabled;
        userData.createdAt = createdAt;
        await userData.save();
      } else {
        const newuserteachers = new userteachers({
          disabled,
          createdAt,
          tname,
          email,
          circle,
          circleAssistant,
          password,
          username,
          udise,
          pan,
          desig,
          convenor,
          school,
          empid,
          teachersID,
          id,
          phone,
          gpAssistant,
          gp,
        });
        await newuserteachers.save();
      }
      teacherData.registered = true;
      await teacherData.save();
      return NextResponse.json(
        {
          message: "userteachers saved successfully",
          success: true,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "Teacher not found",
          success: false,
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
