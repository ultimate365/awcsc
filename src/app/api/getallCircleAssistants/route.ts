import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import allCircleAssistants from "../../../models/allCircleAssistants";

dbConnect();
export async function POST(request: NextRequest) {
  try {
    const allCircleAssistantsData = await allCircleAssistants.find();

    if (allCircleAssistantsData) {
      return NextResponse.json(
        {
          message: "Here is the allCircleAssistants Data",
          success: true,
          statusText: "Success",
          data: allCircleAssistantsData,
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
