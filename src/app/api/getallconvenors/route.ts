import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import allconvenors from "../../../models/allconvenors";

dbConnect();
export async function POST(request: NextRequest) {
  try {
    const allconvenorsData = await allconvenors.find();

    if (allconvenorsData) {
      return NextResponse.json(
        {
          message: "Here is the allconvenors Data",
          success: true,
          statusText: "Success",
          data: allconvenorsData,
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
