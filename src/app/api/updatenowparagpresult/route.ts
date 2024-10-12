import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import nowparagpresult from "../../../models/nowparagpresult";

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

    let nowparagpresultData = await nowparagpresult.findOne({ id });

    if (nowparagpresultData) {
      nowparagpresultData.sclass = sclass;
      nowparagpresultData.event2rank = event2rank;
      nowparagpresultData.event1 = event1;
      nowparagpresultData.name = name;
      nowparagpresultData.school = school;
      nowparagpresultData.studentId = studentId;
      nowparagpresultData.gp = gp;
      nowparagpresultData.event2 = event2;
      nowparagpresultData.group = group;
      nowparagpresultData.udise = udise;
      nowparagpresultData.gender = gender;
      nowparagpresultData.birthday = birthday;
      nowparagpresultData.gurdiansName = gurdiansName;
      nowparagpresultData.event1rank = event1rank;
      nowparagpresultData.chestNo = chestNo;
      nowparagpresultData.position1 = position1;
      nowparagpresultData.position2 = position2;

      await nowparagpresultData.save();
      return NextResponse.json(
        {
          message: "nowparagpresult Data Updated Successfully",
          success: true,
          statusText: "Success",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "nowparagpresult Data Not Found",
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
