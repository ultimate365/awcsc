import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import jhamtiagpresult from "../../../models/jhamtiagpresult";

dbConnect();
export async function POST(request: NextRequest) {
  try {
    const jhamtiagpresultData = await jhamtiagpresult.find();

    if (jhamtiagpresultData) {
      return NextResponse.json(
        {
          message: "Here is the jhamtiagpresult Data",
          success: true,
          statusText: "Success",
          data: jhamtiagpresultData,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "jhamtiagpresult Data Not Found",
          success: false,
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
