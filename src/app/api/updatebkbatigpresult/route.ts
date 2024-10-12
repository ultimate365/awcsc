import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import bkbatigpresult from "../../../models/bkbatigpresult";

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

    let bkbatigpresultData = await bkbatigpresult.findOne({ id });

    if (bkbatigpresultData) {
      bkbatigpresultData.sclass = sclass;
      bkbatigpresultData.event2rank = event2rank;
      bkbatigpresultData.event1 = event1;
      bkbatigpresultData.name = name;
      bkbatigpresultData.school = school;
      bkbatigpresultData.studentId = studentId;
      bkbatigpresultData.gp = gp;
      bkbatigpresultData.event2 = event2;
      bkbatigpresultData.group = group;
      bkbatigpresultData.udise = udise;
      bkbatigpresultData.gender = gender;
      bkbatigpresultData.birthday = birthday;
      bkbatigpresultData.gurdiansName = gurdiansName;
      bkbatigpresultData.event1rank = event1rank;
      bkbatigpresultData.chestNo = chestNo;
      bkbatigpresultData.position1 = position1;
      bkbatigpresultData.position2 = position2;

      await bkbatigpresultData.save();
      return NextResponse.json(
        {
          message: "bkbatigpresult Data Updated Successfully",
          success: true,
          statusText: "Success",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "bkbatigpresult Data Not Found",
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
