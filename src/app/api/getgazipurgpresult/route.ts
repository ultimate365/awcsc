import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import gazipurgpresult from "../../../models/gazipurgpresult";

dbConnect();
export async function POST(request: NextRequest) {
  try {
    const gazipurgpresultData = await gazipurgpresult.find();

    if (gazipurgpresultData) {
      return NextResponse.json(
        {
          message: "Here is the gazipurgpresult Data",
          success: true,
          statusText: "Success",
          data: gazipurgpresultData,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "gazipurgpresult Data Not Found",
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
