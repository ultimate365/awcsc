import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import userteachers from "../../../models/userteachers";

dbConnect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const {
      disabled,

      id,
    }: any = reqBody;

    let userteachersData = await userteachers.findOne({ id });

    if (userteachersData) {
      userteachersData.disabled = disabled;

      await userteachersData.save();
      return NextResponse.json(
        {
          message: "userteachers Data Updated Successfully",
          success: true,
          statusText: "Success",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "userteachers Data Not Found",
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
