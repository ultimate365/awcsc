import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import thaliagpresult from "../../../models/thaliagpresult";
dbConnect();
export async function POST(request: NextRequest) {
  try {
    let response = await thaliagpresult.deleteMany();
    if (response.acknowledged) {
      return NextResponse.json(
        {
          message: "All thaliagpresult deleted successfully",
          success: true,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "thaliagpresult not found",
          success: false,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
