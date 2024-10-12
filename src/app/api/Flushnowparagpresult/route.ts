import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import nowparagpresult from "../../../models/nowparagpresult";
dbConnect();
export async function POST(request: NextRequest) {
  try {
    let response = await nowparagpresult.deleteMany();
    if (response.acknowledged) {
      return NextResponse.json(
        {
          message: "All nowparagpresult deleted successfully",
          success: true,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "nowparagpresult not found",
          success: false,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
