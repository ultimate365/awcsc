import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import jhamtiagpresult from "../../../models/jhamtiagpresult";

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

    let jhamtiagpresultData = await jhamtiagpresult.findOne({ id });

    if (jhamtiagpresultData) {
      jhamtiagpresultData.sclass = sclass;
      jhamtiagpresultData.event2rank = event2rank;
      jhamtiagpresultData.event1 = event1;
      jhamtiagpresultData.name = name;
      jhamtiagpresultData.school = school;
      jhamtiagpresultData.studentId = studentId;
      jhamtiagpresultData.gp = gp;
      jhamtiagpresultData.event2 = event2;
      jhamtiagpresultData.group = group;
      jhamtiagpresultData.udise = udise;
      jhamtiagpresultData.gender = gender;
      jhamtiagpresultData.birthday = birthday;
      jhamtiagpresultData.gurdiansName = gurdiansName;
      jhamtiagpresultData.event1rank = event1rank;
      jhamtiagpresultData.chestNo = chestNo;
      jhamtiagpresultData.position1 = position1;
      jhamtiagpresultData.position2 = position2;

      await jhamtiagpresultData.save();
      return NextResponse.json(
        {
          message: "jhamtiagpresult Data Updated Successfully",
          success: true,
          statusText: "Success",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "jhamtiagpresult Data Not Found",
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
