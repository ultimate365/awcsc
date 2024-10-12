import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import AmtaWestCircleAllResult from "../../../models/AmtaWestCircleAllResult";

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
      position1,
      position2,
    }: any = reqBody;

    let AmtaWestCircleAllResultData = await AmtaWestCircleAllResult.findOne({
      id,
    });

    if (AmtaWestCircleAllResultData) {
      AmtaWestCircleAllResultData.sclass = sclass;
      AmtaWestCircleAllResultData.event2rank = event2rank;
      AmtaWestCircleAllResultData.event1 = event1;
      AmtaWestCircleAllResultData.name = name;
      AmtaWestCircleAllResultData.school = school;
      AmtaWestCircleAllResultData.studentId = studentId;
      AmtaWestCircleAllResultData.gp = gp;
      AmtaWestCircleAllResultData.event2 = event2;
      AmtaWestCircleAllResultData.group = group;
      AmtaWestCircleAllResultData.udise = udise;
      AmtaWestCircleAllResultData.gender = gender;
      AmtaWestCircleAllResultData.birthday = birthday;
      AmtaWestCircleAllResultData.gurdiansName = gurdiansName;
      AmtaWestCircleAllResultData.event1rank = event1rank;
      AmtaWestCircleAllResultData.chestNo = chestNo;
      AmtaWestCircleAllResultData.position1 = position1;
      AmtaWestCircleAllResultData.position2 = position2;

      await AmtaWestCircleAllResultData.save();
      return NextResponse.json(
        {
          message: "AmtaWestCircleAllResult Data Updated Successfully",
          success: true,
          statusText: "Success",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "AmtaWestCircleAllResult Data Not Found",
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
