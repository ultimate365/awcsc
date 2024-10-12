import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import allCircleAssistants from "../../../models/allCircleAssistants";

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

    let allCircleAssistantsData = await allCircleAssistants.findOne({ id });

    if (allCircleAssistantsData) {
      allCircleAssistantsData.udise = udise;
      allCircleAssistantsData.school = school;
      allCircleAssistantsData.tname = tname;
      allCircleAssistantsData.desig = desig;
      allCircleAssistantsData.hoi = hoi;
      allCircleAssistantsData.rank = rank;
      allCircleAssistantsData.empid = empid;
      allCircleAssistantsData.gp = gp;
      allCircleAssistantsData.phone = phone;
      allCircleAssistantsData.email = email;
      allCircleAssistantsData.pan = pan;
      allCircleAssistantsData.circle = circle;
      allCircleAssistantsData.registered = registered;
      allCircleAssistantsData.dataYear = dataYear;
      allCircleAssistantsData.convenor = convenor;
      allCircleAssistantsData.gpAssistant = gpAssistant;

      await allCircleAssistantsData.save();
      return NextResponse.json(
        {
          message: "allCircleAssistants Data Updated Successfully",
          success: true,
          statusText: "Success",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "allCircleAssistants Data Not Found",
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
