import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import amoragorigpresult from "../../../models/amoragorigpresult";

dbConnect();
export async function POST(request: NextRequest) {
  try {
    const amoragorigpresultData = await amoragorigpresult.find();

    if (amoragorigpresultData) {
      return NextResponse.json(
        {
          message: "Here is the amoragorigpresult Data",
          success: true,
          statusText: "Success",
          data: amoragorigpresultData,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "amoragorigpresult Data Not Found",
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
