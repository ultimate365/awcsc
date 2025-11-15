import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { phone } = await req.json();

    const res = await fetch("https://api.msg91.com/api/v5/otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.MSG91_TOKEN_AUTH}`,
      },
      body: JSON.stringify({
        mobile: phone,
        template_id: process.env.MSG91_TEMPLATE_ID,
      }),
    });

    const data = await res.json();

    if (data.type === "success") {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, message: data.message });
    }
  } catch (e) {
    return NextResponse.json({ success: false, message: e.message });
  }
}
