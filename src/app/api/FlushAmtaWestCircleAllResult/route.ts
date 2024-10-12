import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import AmtaWestCircleAllResult from "../../../models/AmtaWestCircleAllResult";
dbConnect();
export async function POST(request: NextRequest) {
  try {
    let response = await AmtaWestCircleAllResult.deleteMany();
    if (response.acknowledged) {
      return NextResponse.json(
        {
          message: "All AmtaWestCircleAllResult deleted successfully",
          success: true,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "AmtaWestCircleAllResult not found",
          success: false,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
