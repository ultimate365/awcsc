import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import gazipurgpresult from "../../../models/gazipurgpresult";

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

    let gazipurgpresultData = await gazipurgpresult.findOne({ id });

    if (gazipurgpresultData) {
      gazipurgpresultData.sclass = sclass;
      gazipurgpresultData.event2rank = event2rank;
      gazipurgpresultData.event1 = event1;
      gazipurgpresultData.name = name;
      gazipurgpresultData.school = school;
      gazipurgpresultData.studentId = studentId;
      gazipurgpresultData.gp = gp;
      gazipurgpresultData.event2 = event2;
      gazipurgpresultData.group = group;
      gazipurgpresultData.udise = udise;
      gazipurgpresultData.gender = gender;
      gazipurgpresultData.birthday = birthday;
      gazipurgpresultData.gurdiansName = gurdiansName;
      gazipurgpresultData.event1rank = event1rank;
      gazipurgpresultData.chestNo = chestNo;
      gazipurgpresultData.position1 = position1;
      gazipurgpresultData.position2 = position2;

      await gazipurgpresultData.save();
      return NextResponse.json(
        {
          message: "gazipurgpresult Data Updated Successfully",
          success: true,
          statusText: "Success",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "gazipurgpresult Data Not Found",
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
