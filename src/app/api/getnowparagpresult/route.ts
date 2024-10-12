import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import nowparagpresult from "../../../models/nowparagpresult";

dbConnect();
export async function POST(request: NextRequest) {
  try {
    const nowparagpresultData = await nowparagpresult.find();

    if (nowparagpresultData) {
      return NextResponse.json(
        {
          message: "Here is the nowparagpresult Data",
          success: true,
          statusText: "Success",
          data: nowparagpresultData,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "nowparagpresult Data Not Found",
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
