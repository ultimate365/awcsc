import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import AmtaWestCircleFirstResult from "../../../models/AmtaWestCircleFirstResult";

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

    let AmtaWestCircleFirstResultData = await AmtaWestCircleFirstResult.findOne(
      {
        id,
      }
    );

    if (AmtaWestCircleFirstResultData) {
      AmtaWestCircleFirstResultData.sclass = sclass;
      AmtaWestCircleFirstResultData.event2rank = event2rank;
      AmtaWestCircleFirstResultData.event1 = event1;
      AmtaWestCircleFirstResultData.name = name;
      AmtaWestCircleFirstResultData.school = school;
      AmtaWestCircleFirstResultData.studentId = studentId;
      AmtaWestCircleFirstResultData.gp = gp;
      AmtaWestCircleFirstResultData.event2 = event2;
      AmtaWestCircleFirstResultData.group = group;
      AmtaWestCircleFirstResultData.udise = udise;
      AmtaWestCircleFirstResultData.gender = gender;
      AmtaWestCircleFirstResultData.birthday = birthday;
      AmtaWestCircleFirstResultData.gurdiansName = gurdiansName;
      AmtaWestCircleFirstResultData.event1rank = event1rank;
      AmtaWestCircleFirstResultData.chestNo = chestNo;
      AmtaWestCircleFirstResultData.position = position;

      await AmtaWestCircleFirstResultData.save();
      return NextResponse.json(
        {
          message: "AmtaWestCircleFirstResult Data Updated Successfully",
          success: true,
          statusText: "Success",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "AmtaWestCircleFirstResult Data Not Found",
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
