import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import amoragorigpresult from "../../../models/amoragorigpresult";

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

    let amoragorigpresultData = await amoragorigpresult.findOne({ id });

    if (amoragorigpresultData) {
      amoragorigpresultData.sclass = sclass;
      amoragorigpresultData.event2rank = event2rank;
      amoragorigpresultData.event1 = event1;
      amoragorigpresultData.name = name;
      amoragorigpresultData.school = school;
      amoragorigpresultData.studentId = studentId;
      amoragorigpresultData.gp = gp;
      amoragorigpresultData.event2 = event2;
      amoragorigpresultData.group = group;
      amoragorigpresultData.udise = udise;
      amoragorigpresultData.gender = gender;
      amoragorigpresultData.birthday = birthday;
      amoragorigpresultData.gurdiansName = gurdiansName;
      amoragorigpresultData.event1rank = event1rank;
      amoragorigpresultData.chestNo = chestNo;
      amoragorigpresultData.position1 = position1;
      amoragorigpresultData.position2 = position2;

      await amoragorigpresultData.save();
      return NextResponse.json(
        {
          message: "amoragorigpresult Data Updated Successfully",
          success: true,
          statusText: "Success",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "amoragorigpresult Data Not Found",
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
