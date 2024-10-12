import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import AmtaWestCircleFirstResult from "../../../models/AmtaWestCircleFirstResult";

dbConnect();
export async function POST(request: NextRequest) {
  try {
    const AmtaWestCircleFirstResultData =
      await AmtaWestCircleFirstResult.find();

    if (AmtaWestCircleFirstResultData) {
      return NextResponse.json(
        {
          message: "Here is the AmtaWestCircleFirstResult Data",
          success: true,
          statusText: "Success",
          data: AmtaWestCircleFirstResultData,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "AmtaWestCircleFirstResult Data Not Found",
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
