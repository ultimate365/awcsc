import dbConnect from "../../../lib/dbConnect";
import allGPFirsts from "../../../models/allGPFirsts";
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
      position,
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

    const newallGPFirsts = new allGPFirsts({
      sclass,
      event2rank,
      event1,
      name,
      school,
      studentId,
      position,
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
    await newallGPFirsts.save();

    return NextResponse.json(
      {
        message: "allGPFirsts saved successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
