import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import allGPAssistants from "../../../models/allGPAssistants";
dbConnect();
export async function POST(request: NextRequest) {
  try {
    let response = await allGPAssistants.deleteMany();
    if (response.acknowledged) {
      return NextResponse.json(
        {
          message: "All allGPAssistants deleted successfully",
          success: true,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "allGPAssistants not found",
          success: false,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
