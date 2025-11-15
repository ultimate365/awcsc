import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import EmailOtp from "../../../models/emailOtp";
import verifyEmailMailer from "../../../lib/verifyEmailMailer";

dbConnect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, name, username }: any = reqBody;
    console.log(email, name, username);
    const emailOtp = Math.floor(100000 + Math.random() * 900000);
    const emailOtpdata = new EmailOtp({
      email: email,
      code: emailOtp,
      expiresIn: new Date().getTime() + 300 * 1000,
    });

    if (email) await verifyEmailMailer(email, emailOtp, name, username);

    await emailOtpdata.save();
    return NextResponse.json(
      { message: "OTP sent successfully", success: true },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "Error sending OTP", success: false },
      { status: 200 }
    );
  }
}
