import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import gpLockData from "../../../models/gpLockData";

dbConnect();
export async function POST(request: NextRequest) {
  try {
    const gpLockDataData = await gpLockData.find();

    if (gpLockDataData) {
      return NextResponse.json(
        {
          message: "Here is the gpLockData Data",
          success: true,
          statusText: "Success",
          data: gpLockDataData,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "gpLockData Data Not Found",
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
