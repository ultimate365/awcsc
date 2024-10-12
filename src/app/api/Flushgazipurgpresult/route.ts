import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import gazipurgpresult from "../../../models/gazipurgpresult";
dbConnect();
export async function POST(request: NextRequest) {
  try {
    let response = await gazipurgpresult.deleteMany();
    if (response.acknowledged) {
      return NextResponse.json(
        {
          message: "All gazipurgpresult deleted successfully",
          success: true,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "gazipurgpresult not found",
          success: false,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
