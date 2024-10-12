import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import circleLockData from "../../../models/circleLockData";

dbConnect();
export async function POST(request: NextRequest) {
  try {
    const circleLockDataData = await circleLockData.find();

    if (circleLockDataData) {
      return NextResponse.json(
        {
          message: "Here is the circleLockData Data",
          success: true,
          statusText: "Success",
          data: circleLockDataData,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "circleLockData Data Not Found",
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
