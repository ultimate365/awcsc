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
