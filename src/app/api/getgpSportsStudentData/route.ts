import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import gpSportsStudentData from "../../../models/gpSportsStudentData";

dbConnect();
export async function POST(request: NextRequest) {
  try {
    const gpSportsStudentDataData = await gpSportsStudentData.find();

    if (gpSportsStudentDataData) {
      return NextResponse.json(
        {
          message: "Here is the gpSportsStudentData Data",
          success: true,
          statusText: "Success",
          data: gpSportsStudentDataData,
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
