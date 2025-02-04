import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import allGPFirsts from "../../../models/allGPFirsts";
dbConnect();
export async function POST(request: NextRequest) {
  try {
    let response = await allGPFirsts.deleteMany();
    if (response.acknowledged) {
      return NextResponse.json(
        {
          message: "All allGPFirsts deleted successfully",
          success: true,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "allGPFirsts not found",
          success: false,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
