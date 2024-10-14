import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import teachers from "../../../models/teachers";
import userteachers from "../../../models/userteachers";

dbConnect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const {
      id,
      udise,
      school,
      tname,
      desig,
      hoi,
      rank,
      empid,
      gp,
      phone,
      email,
      pan,
      circle,
      registered,
      dataYear,
      convenor,
      gpAssistant,
      circleAssistant,
    }: any = reqBody;

    let teachersData = await teachers.findOne({ id });
    let userData = await userteachers.findOne({ id });

    if (teachersData) {
      teachersData.udise = udise;
      teachersData.school = school;
      teachersData.tname = tname;
      teachersData.desig = desig;
      teachersData.hoi = hoi;
      teachersData.rank = rank;
      teachersData.empid = empid;
      teachersData.gp = gp;
      teachersData.phone = phone;
      teachersData.email = email;
      teachersData.pan = pan;
      teachersData.circle = circle;
      teachersData.registered = registered;
      teachersData.dataYear = dataYear;
      teachersData.convenor = convenor;
      teachersData.gpAssistant = gpAssistant;
      teachersData.circleAssistant = circleAssistant;

      await teachersData.save();
      if (userData) {
        userData.tname = tname;
        userData.circle = school;
        userData.circleAssistant = circleAssistant;
        userData.udise = udise;
        userData.pan = pan;
        userData.desig = desig;
        userData.school = school;
        userData.empid = empid;
        userData.gpAssistant = gpAssistant;
        userData.gp = gp;
        userData.convenor = convenor;

        await userData.save();
      }
      return NextResponse.json(
        {
          message: "teachers Data Updated Successfully",
          success: true,
          statusText: "Success",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "teachers Data Not Found",
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
