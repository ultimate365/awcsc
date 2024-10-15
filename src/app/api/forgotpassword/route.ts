import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import sendEmail from "../../../lib/mailer";
import Otp from "../../../models/otp";
import Userteachers from "../../../models/userteachers";
dbConnect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email }: any = reqBody;
    console.log(email);
    const data = await Userteachers.findOne({ email });

    const name = data.tname;

    if (data) {
      const otp = Math.floor(Math.random() * 1000000 + 1);
      const result = await Otp.create({
        email: email,
        code: otp,
        expiresIn: new Date().getTime() + 300 * 1000,
      });
      await sendEmail({ email, code: otp, name });

      return NextResponse.json(
        {
          message: "OTP Sent, Please check your Email",
          success: true,
          data: result,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "User Email Not Found",
          success: false,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
