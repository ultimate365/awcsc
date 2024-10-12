import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import allconvenors from "../../../models/allconvenors";

dbConnect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { id, convenor }: any = reqBody;

    let allconvenorsData = await allconvenors.findOne({ id });

    if (allconvenorsData) {
      allconvenorsData.convenor = convenor;

      await allconvenorsData.save();
      return NextResponse.json(
        {
          message: "allconvenors Data Updated Successfully",
          success: true,
          statusText: "Success",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "allconvenors Data Not Found",
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
