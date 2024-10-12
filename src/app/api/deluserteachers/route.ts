import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import userteachers from "../../../models/userteachers";
import teachers from "../../../models/teachers";
dbConnect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { id }: any = reqBody;

    let response = await userteachers.deleteOne({ id });
    if (response.acknowledged) {
      const teacherData = await teachers.findOne({ id });
      teacherData.registered = false;
      await teacherData.save();
      return NextResponse.json(
        {
          message: "userteachers deleted successfully",
          success: true,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "userteachers not found",
          success: false,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
