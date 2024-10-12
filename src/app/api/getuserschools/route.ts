import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import userschools from "../../../models/userschools";

dbConnect();
export async function POST(request: NextRequest) {
  try {
    const userschoolsData = await userschools.find();

    if (userschoolsData) {
      return NextResponse.json(
        {
          message: "Here is the userschools Data",
          success: true,
          statusText: "Success",
          data: userschoolsData,
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
