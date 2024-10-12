import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import gpSportsStudentData from "../../../models/gpSportsStudentData";

dbConnect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const {
      id,

      chestNo,
    }: any = reqBody;

    let gpSportsStudentDataData = await gpSportsStudentData.findOne({ id });

    if (gpSportsStudentDataData) {
      gpSportsStudentDataData.chestNo = chestNo;

      await gpSportsStudentDataData.save();
      return NextResponse.json(
        {
          message: "gpSportsStudentData Data Updated Successfully",
          success: true,
          statusText: "Success",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "gpSportsStudentData Data Not Found",
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
