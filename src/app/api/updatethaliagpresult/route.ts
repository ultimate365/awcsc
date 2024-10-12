import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import thaliagpresult from "../../../models/thaliagpresult";

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

    let thaliagpresultData = await thaliagpresult.findOne({ id });

    if (thaliagpresultData) {
      thaliagpresultData.sclass = sclass;
      thaliagpresultData.event2rank = event2rank;
      thaliagpresultData.event1 = event1;
      thaliagpresultData.name = name;
      thaliagpresultData.school = school;
      thaliagpresultData.studentId = studentId;
      thaliagpresultData.gp = gp;
      thaliagpresultData.event2 = event2;
      thaliagpresultData.group = group;
      thaliagpresultData.udise = udise;
      thaliagpresultData.gender = gender;
      thaliagpresultData.birthday = birthday;
      thaliagpresultData.gurdiansName = gurdiansName;
      thaliagpresultData.event1rank = event1rank;
      thaliagpresultData.chestNo = chestNo;
      thaliagpresultData.position1 = position1;
      thaliagpresultData.position2 = position2;

      await thaliagpresultData.save();
      return NextResponse.json(
        {
          message: "thaliagpresult Data Updated Successfully",
          success: true,
          statusText: "Success",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "thaliagpresult Data Not Found",
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
