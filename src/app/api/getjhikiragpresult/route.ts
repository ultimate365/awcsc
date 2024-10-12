import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import jhikiragpresult from "../../../models/jhikiragpresult";

dbConnect();
export async function POST(request: NextRequest) {
  try {
    const jhikiragpresultData = await jhikiragpresult.find();

    if (jhikiragpresultData) {
      return NextResponse.json(
        {
          message: "Here is the jhikiragpresult Data",
          success: true,
          statusText: "Success",
          data: jhikiragpresultData,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "jhikiragpresult Data Not Found",
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
