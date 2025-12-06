import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

import Otp from "../../../models/otp";
import Userteachers from "../../../models/userteachers";
dbConnect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, code, password }: any = reqBody;

    let data = await Otp.findOne({ email, code });

    if (data) {
      let currentTime = new Date().getTime();
      let difference = data.expiresIn - currentTime;
      if (difference < 0) {
        return NextResponse.json(
          {
            message: "OTP Expired",
            success: false,
            statusText: "error",
          },
          { status: 200 }
        );
      } else {
        let userteachers = await Userteachers.findOne({ email });
        userteachers.password = password;
        userteachers.save();

        await Otp.deleteMany({ email });

        return NextResponse.json(
          {
            message: "Password Changed Successfully",
            success: true,
            statusText: "Success",
          },
          { status: 200 }
        );
      }
    } else {
      return NextResponse.json(
        {
          message: "Invalid OTP Code",
          success: false,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
