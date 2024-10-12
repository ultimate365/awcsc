import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import allconvenors from "../../../models/allconvenors";

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
    }: any = reqBody;

    let allconvenorsData = await allconvenors.findOne({ id });

    if (allconvenorsData) {
      allconvenorsData.udise = udise;
      allconvenorsData.school = school;
      allconvenorsData.tname = tname;
      allconvenorsData.desig = desig;
      allconvenorsData.hoi = hoi;
      allconvenorsData.rank = rank;
      allconvenorsData.empid = empid;
      allconvenorsData.gp = gp;
      allconvenorsData.phone = phone;
      allconvenorsData.email = email;
      allconvenorsData.pan = pan;
      allconvenorsData.circle = circle;
      allconvenorsData.registered = registered;
      allconvenorsData.dataYear = dataYear;
      allconvenorsData.convenor = convenor;
      allconvenorsData.gpAssistant = gpAssistant;

      await allconvenorsData.save();
      return NextResponse.json(
        {
          message: "allconvenors Data Updated Successfully",
          success: true,
          statusText: "Success",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "allconvenors Data Not Found",
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
