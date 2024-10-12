import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import AmtaWestCircleFirstResult from "../../../models/AmtaWestCircleFirstResult";
dbConnect();
export async function POST(request: NextRequest) {
  try {
    let response = await AmtaWestCircleFirstResult.deleteMany();
    if (response.acknowledged) {
      return NextResponse.json(
        {
          message: "All AmtaWestCircleFirstResult deleted successfully",
          success: true,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "AmtaWestCircleFirstResult not found",
          success: false,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
