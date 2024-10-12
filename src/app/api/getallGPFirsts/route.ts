import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import allGPFirsts from "../../../models/allGPFirsts";

dbConnect();
export async function POST(request: NextRequest) {
  try {
    const allGPFirstsData = await allGPFirsts.find();

    if (allGPFirstsData) {
      return NextResponse.json(
        {
          message: "Here is the allGPFirsts Data",
          success: true,
          statusText: "Success",
          data: allGPFirstsData,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "allGPFirsts Data Not Found",
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
