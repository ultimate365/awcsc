import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import gpLockData from "../../../models/gpLockData";

dbConnect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const {
      closeDate,
      edit,
      entryCloseddBy,
      entryDate,
      entryStaredBy,
      gp,
      id,
    }: any = reqBody;

    let gpLockDataData = await gpLockData.findOne({ id });

    if (gpLockDataData) {
      gpLockDataData.closeDate = closeDate;
      gpLockDataData.edit = edit;
      gpLockDataData.entryCloseddBy = entryCloseddBy;
      gpLockDataData.entryDate = entryDate;
      gpLockDataData.entryStaredBy = entryStaredBy;
      gpLockDataData.gp = gp;

      await gpLockDataData.save();
      return NextResponse.json(
        {
          message: "gpLockData Data Updated Successfully",
          success: true,
          statusText: "Success",
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
