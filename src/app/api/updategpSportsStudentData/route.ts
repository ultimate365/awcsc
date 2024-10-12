import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import gpSportsStudentData from "../../../models/gpSportsStudentData";

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
    }: any = reqBody;

    let gpSportsStudentDataData = await gpSportsStudentData.findOne({ id });

    if (gpSportsStudentDataData) {
      gpSportsStudentDataData.sclass = sclass;
      gpSportsStudentDataData.event2rank = event2rank;
      gpSportsStudentDataData.event1 = event1;
      gpSportsStudentDataData.name = name;
      gpSportsStudentDataData.school = school;
      gpSportsStudentDataData.studentId = studentId;
      gpSportsStudentDataData.gp = gp;
      gpSportsStudentDataData.event2 = event2;
      gpSportsStudentDataData.group = group;
      gpSportsStudentDataData.udise = udise;
      gpSportsStudentDataData.gender = gender;
      gpSportsStudentDataData.birthday = birthday;
      gpSportsStudentDataData.gurdiansName = gurdiansName;
      gpSportsStudentDataData.event1rank = event1rank;
      gpSportsStudentDataData.chestNo = chestNo;

      await gpSportsStudentDataData.save();
      return NextResponse.json(
        {
          message: "gpSportsStudentData Data Updated Successfully",
          success: true,
          statusText: "Success",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "gpSportsStudentData Data Not Found",
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
