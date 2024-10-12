import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import allGPAssistants from "../../../models/allGPAssistants";

dbConnect();
export async function POST(request: NextRequest) {
  try {
    const allGPAssistantsData = await allGPAssistants.find();

    if (allGPAssistantsData) {
      return NextResponse.json(
        {
          message: "Here is the allGPAssistants Data",
          success: true,
          statusText: "Success",
          data: allGPAssistantsData,
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
