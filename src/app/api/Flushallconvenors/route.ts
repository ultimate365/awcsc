import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import allconvenors from "../../../models/allconvenors";
dbConnect();
export async function POST(request: NextRequest) {
  try {
    let response = await allconvenors.deleteMany();
    if (response.acknowledged) {
      return NextResponse.json(
        {
          message: "All allconvenors deleted successfully",
          success: true,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "allconvenors not found",
          success: false,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
