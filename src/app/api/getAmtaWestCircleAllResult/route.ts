import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import AmtaWestCircleAllResult from "../../../models/AmtaWestCircleAllResult";

dbConnect();
export async function POST(request: NextRequest) {
  try {
    const AmtaWestCircleAllResultData = await AmtaWestCircleAllResult.find();

    if (AmtaWestCircleAllResultData) {
      return NextResponse.json(
        {
          message: "Here is the AmtaWestCircleAllResult Data",
          success: true,
          statusText: "Success",
          data: AmtaWestCircleAllResultData,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "AmtaWestCircleAllResult Data Not Found",
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
