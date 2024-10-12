import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import allGPAssistants from "../../../models/allGPAssistants";

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

    let allGPAssistantsData = await allGPAssistants.findOne({ id });

    if (allGPAssistantsData) {
      allGPAssistantsData.udise = udise;
      allGPAssistantsData.school = school;
      allGPAssistantsData.tname = tname;
      allGPAssistantsData.desig = desig;
      allGPAssistantsData.hoi = hoi;
      allGPAssistantsData.rank = rank;
      allGPAssistantsData.empid = empid;
      allGPAssistantsData.gp = gp;
      allGPAssistantsData.phone = phone;
      allGPAssistantsData.email = email;
      allGPAssistantsData.pan = pan;
      allGPAssistantsData.circle = circle;
      allGPAssistantsData.registered = registered;
      allGPAssistantsData.dataYear = dataYear;
      allGPAssistantsData.convenor = convenor;
      allGPAssistantsData.gpAssistant = gpAssistant;

      await allGPAssistantsData.save();
      return NextResponse.json(
        {
          message: "allGPAssistants Data Updated Successfully",
          success: true,
          statusText: "Success",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "allGPAssistants Data Not Found",
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
