import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import jhikiragpresult from "../../../models/jhikiragpresult";

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

    let jhikiragpresultData = await jhikiragpresult.findOne({ id });

    if (jhikiragpresultData) {
      jhikiragpresultData.sclass = sclass;
      jhikiragpresultData.event2rank = event2rank;
      jhikiragpresultData.event1 = event1;
      jhikiragpresultData.name = name;
      jhikiragpresultData.school = school;
      jhikiragpresultData.studentId = studentId;
      jhikiragpresultData.gp = gp;
      jhikiragpresultData.event2 = event2;
      jhikiragpresultData.group = group;
      jhikiragpresultData.udise = udise;
      jhikiragpresultData.gender = gender;
      jhikiragpresultData.birthday = birthday;
      jhikiragpresultData.gurdiansName = gurdiansName;
      jhikiragpresultData.event1rank = event1rank;
      jhikiragpresultData.chestNo = chestNo;
      jhikiragpresultData.position1 = position1;
      jhikiragpresultData.position2 = position2;

      await jhikiragpresultData.save();
      return NextResponse.json(
        {
          message: "jhikiragpresult Data Updated Successfully",
          success: true,
          statusText: "Success",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "jhikiragpresult Data Not Found",
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
