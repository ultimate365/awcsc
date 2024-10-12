import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import schools from "../../../models/schools";

dbConnect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { id, school, udise, gp, year, hoi }: any = reqBody;

    let schoolsData = await schools.findOne({ id });

    if (schoolsData) {
      schoolsData.school = school;
      schoolsData.udise = udise;
      schoolsData.gp = gp;
      schoolsData.year = year;
      schoolsData.hoi = hoi;

      await schoolsData.save();
      return NextResponse.json(
        {
          message: "schools Data Updated Successfully",
          success: true,
          statusText: "Success",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "schools Data Not Found",
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
