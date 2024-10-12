import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import allGPFirsts from "../../../models/allGPFirsts";

dbConnect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { id, chestNo }: any = reqBody;

    let allGPFirstsData = await allGPFirsts.findOne({ id });

    if (allGPFirstsData) {
      allGPFirstsData.chestNo = chestNo;

      await allGPFirstsData.save();
      return NextResponse.json(
        {
          message: "allGPFirsts Chest No. Updated Successfully",
          success: true,
          statusText: "Success",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "allGPFirsts Data Not Found",
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
