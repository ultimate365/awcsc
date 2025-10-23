import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import EmailOtp from "../../../models/emailOtp";
import Userteachers from "../../../models/userteachers";
dbConnect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, code }: any = reqBody;
    const data = await EmailOtp.findOne({ email, code: parseInt(code) });
    if (data) {
      const currentTime = new Date().getTime();
      const difference = data.expiresIn - currentTime;
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
        const userteachers = await Userteachers.findOne({ email });
        if (userteachers) {
          userteachers.email = email;
          userteachers.save();
        }
        await EmailOtp.deleteMany({ email });

        return NextResponse.json(
          {
            message: "Email Verified and Changed Successfully",
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
