import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import userteachers from "../../../models/userteachers";

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

    let userteachersData = await userteachers.findOne({ id });

    if (userteachersData) {
      userteachersData.udise = udise;
      userteachersData.disabled = disabled;
      userteachersData.createdAt = createdAt;
      userteachersData.circleAssistant = circleAssistant;
      userteachersData.password = password;
      userteachersData.username = username;
      userteachersData.teachersID = teachersID;
      userteachersData.school = school;
      userteachersData.tname = tname;
      userteachersData.desig = desig;
      userteachersData.empid = empid;
      userteachersData.gp = gp;
      userteachersData.phone = phone;
      userteachersData.email = email;
      userteachersData.pan = pan;
      userteachersData.circle = circle;
      userteachersData.convenor = convenor;
      userteachersData.gpAssistant = gpAssistant;

      await userteachersData.save();
      return NextResponse.json(
        {
          message: "userteachers Data Updated Successfully",
          success: true,
          statusText: "Success",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "userteachers Data Not Found",
          success: false,
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
