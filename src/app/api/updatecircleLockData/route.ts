import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import circleLockData from "../../../models/circleLockData";

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

    let circleLockDataData = await circleLockData.findOne({ id });

    if (circleLockDataData) {
      circleLockDataData.closeDate = closeDate;
      circleLockDataData.edit = edit;
      circleLockDataData.entryCloseddBy = entryCloseddBy;
      circleLockDataData.entryDate = entryDate;
      circleLockDataData.entryStaredBy = entryStaredBy;
      circleLockDataData.gp = gp;

      await circleLockDataData.save();
      return NextResponse.json(
        {
          message: "circleLockData Data Updated Successfully",
          success: true,
          statusText: "Success",
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
