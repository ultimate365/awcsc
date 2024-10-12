import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import bkbatigpresult from "../../../models/bkbatigpresult";

dbConnect();
export async function POST(request: NextRequest) {
  try {
    const bkbatigpresultData = await bkbatigpresult.find();

    if (bkbatigpresultData) {
      return NextResponse.json(
        {
          message: "Here is the bkbatigpresult Data",
          success: true,
          statusText: "Success",
          data: bkbatigpresultData,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "bkbatigpresult Data Not Found",
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
