import dbConnect from "../../../lib/dbConnect";
import allGPAssistants from "../../../models/allGPAssistants";
import { NextRequest, NextResponse } from "next/server";

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

    const newallGPAssistants = new allGPAssistants({
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
    });
    await newallGPAssistants.save();

    return NextResponse.json(
      {
        message: "allGPAssistants saved successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
