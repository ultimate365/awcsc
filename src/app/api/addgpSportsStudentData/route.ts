import dbConnect from "../../../lib/dbConnect";
import gpSportsStudentData from "../../../models/gpSportsStudentData";
import { NextRequest, NextResponse } from "next/server";

dbConnect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const {
      sclass,
      event2rank,
      event1,
      name,
      school,
      studentId,
      gp,
      event2,
      group,
      id,
      udise,
      gender,
      birthday,
      gurdiansName,
      event1rank,
      chestNo,
    }: any = reqBody;

    const newgpSportsStudentData = new gpSportsStudentData({
      sclass,
      event2rank,
      event1,
      name,
      school,
      studentId,
      gp,
      event2,
      group,
      id,
      udise,
      gender,
      birthday,
      gurdiansName,
      event1rank,
      chestNo,
    });
    await newgpSportsStudentData.save();

    return NextResponse.json(
      {
        message: "gpSportsStudentData saved successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
