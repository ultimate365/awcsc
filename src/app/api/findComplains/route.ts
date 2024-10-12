import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import Complains from "../../../models/complains";

dbConnect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { id }: any = reqBody;

    const complainData = await Complains.findOne({ id });

    if (complainData) {
      return NextResponse.json(
        {
          message: "Here is a complain",
          success: true,
          statusText: "Success",
          data: complainData,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "Complain Data Not Found",
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
