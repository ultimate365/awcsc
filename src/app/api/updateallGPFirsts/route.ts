import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import allGPFirsts from "../../../models/allGPFirsts";

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
      position,
    }: any = reqBody;

    let allGPFirstsData = await allGPFirsts.findOne({ id });

    if (allGPFirstsData) {
      allGPFirstsData.sclass = sclass;
      allGPFirstsData.event2rank = event2rank;
      allGPFirstsData.event1 = event1;
      allGPFirstsData.name = name;
      allGPFirstsData.school = school;
      allGPFirstsData.studentId = studentId;
      allGPFirstsData.gp = gp;
      allGPFirstsData.event2 = event2;
      allGPFirstsData.group = group;
      allGPFirstsData.udise = udise;
      allGPFirstsData.gender = gender;
      allGPFirstsData.birthday = birthday;
      allGPFirstsData.gurdiansName = gurdiansName;
      allGPFirstsData.event1rank = event1rank;
      allGPFirstsData.chestNo = chestNo;
      allGPFirstsData.position = position;

      await allGPFirstsData.save();
      return NextResponse.json(
        {
          message: "allGPFirsts Data Updated Successfully",
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
