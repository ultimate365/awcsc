import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import PhoneOtp from "../../../models/phoneOtp";
import { sendOTPSMS } from "../../../lib/sendVerificationSMS";
dbConnect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { phone }: any = reqBody;
    const mobileOtp = Math.floor(100000 + Math.random() * 900000);
    let mobileOtpdata = new PhoneOtp({
      phone: phone,
      code: mobileOtp,
      expiresIn: new Date().getTime() + 300 * 1000,
    });
    await sendOTPSMS(phone, mobileOtp);
    await mobileOtpdata.save();
    return NextResponse.json(
      {
        message: "OTP Sent, Please check your Mobile",
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
