import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import teachers from "../../../models/teachers";
import userteachers from "../../../models/userteachers";

dbConnect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { id, convenor, gpAssistant, circleAssistant }: any = reqBody;

    const teachersData = await teachers.findOne({ id });
    const userteachersData = await userteachers.findOne({ id });

    if (teachersData) {
      if (convenor) {
        teachersData.convenor = convenor;
      }
      if (gpAssistant) {
        teachersData.gpAssistant = gpAssistant;
      }
      if (circleAssistant) {
        teachersData.circleAssistant = circleAssistant;
      }
      if (userteachersData) {
        if (convenor) {
          userteachersData.convenor = convenor;
        }
        if (gpAssistant) {
          userteachersData.gpAssistant = gpAssistant;
        }
        if (circleAssistant) {
          userteachersData.circleAssistant = circleAssistant;
        }
        await userteachersData.save();
      }
      await teachersData.save();
      return NextResponse.json(
        {
          message: "teachers Data Updated Successfully",
          success: true,
          statusText: "Success",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "teachers Data Not Found",
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
