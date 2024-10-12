import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import userteachers from "../../../models/userteachers";

dbConnect();
export async function POST(request: NextRequest) {
  try {
    const userteachersData = await userteachers.find();

    if (userteachersData) {
      return NextResponse.json(
        {
          message: "Here is the userteachers Data",
          success: true,
          statusText: "Success",
          data: userteachersData,
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
