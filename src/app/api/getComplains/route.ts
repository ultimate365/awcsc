import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import Complains from "../../../models/complains";

dbConnect();
export async function POST(request: NextRequest) {
  try {
    const complainData = await Complains.find();

    if (complainData) {
      return NextResponse.json(
        {
          message: "Here is the complains",
          success: true,
          statusText: "Success",
          data: complainData,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "Complain Data Not Found",
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
