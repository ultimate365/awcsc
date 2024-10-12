import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import userschools from "../../../models/userschools";

dbConnect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const {
      id,
      school,
      udise,
      username,
      gp,
      year,
      hoi,
      convenor,
      password,
    }: any = reqBody;

    let userschoolsData = await userschools.findOne({ id });

    if (userschoolsData) {
      userschoolsData.school = school;
      userschoolsData.udise = udise;
      userschoolsData.username = username;
      userschoolsData.gp = gp;
      userschoolsData.year = year;
      userschoolsData.hoi = hoi;
      userschoolsData.convenor = convenor;
      userschoolsData.password = password;

      await userschoolsData.save();
      return NextResponse.json(
        {
          message: "userschools Data Updated Successfully",
          success: true,
          statusText: "Success",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "userschools Data Not Found",
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
