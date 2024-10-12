import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import thaliagpresult from "../../../models/thaliagpresult";

dbConnect();
export async function POST(request: NextRequest) {
  try {
    const thaliagpresultData = await thaliagpresult.find();

    if (thaliagpresultData) {
      return NextResponse.json(
        {
          message: "Here is the thaliagpresult Data",
          success: true,
          statusText: "Success",
          data: thaliagpresultData,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "thaliagpresult Data Not Found",
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
