import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import jhikiragpresult from "../../../models/jhikiragpresult";
dbConnect();
export async function POST(request: NextRequest) {
  try {
    let response = await jhikiragpresult.deleteMany();
    if (response.acknowledged) {
      return NextResponse.json(
        {
          message: "All jhikiragpresult deleted successfully",
          success: true,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "jhikiragpresult not found",
          success: false,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}