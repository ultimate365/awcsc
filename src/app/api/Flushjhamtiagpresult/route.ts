import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import jhamtiagpresult from "../../../models/jhamtiagpresult";
dbConnect();
export async function POST(request: NextRequest) {
  try {
    let response = await jhamtiagpresult.deleteMany();
    if (response.acknowledged) {
      return NextResponse.json(
        {
          message: "All jhamtiagpresult deleted successfully",
          success: true,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "jhamtiagpresult not found",
          success: false,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
