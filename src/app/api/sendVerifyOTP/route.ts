import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import PhoneOtp from "../../../models/phoneOtp";
import EmailOtp from "../../../models/emailOtp";
import verifyEmailMailer from "../../../lib/verifyEmailMailer";
import { sendOTPSMS } from "../../../lib/sendVerificationSMS";
dbConnect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { phone, email, name }: any = reqBody;

    const mobileOtp = Math.floor(100000 + Math.random() * 900000);
    const emailOtp = Math.floor(100000 + Math.random() * 900000);

    let mobileOtpdata = new PhoneOtp({
      phone: phone,
      code: mobileOtp,
      expiresIn: new Date().getTime() + 300 * 1000,
    });
    let emailOtpdata = new EmailOtp({
      email: email,
      code: emailOtp,
      expiresIn: new Date().getTime() + 300 * 1000,
    });

    await sendOTPSMS(phone, mobileOtp);
    await verifyEmailMailer(email, emailOtp, name);
    await mobileOtpdata.save();
    await emailOtpdata.save();
    return NextResponse.json(
      {
        message: "OTP Sent, Please check your Mobile and Email",
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
