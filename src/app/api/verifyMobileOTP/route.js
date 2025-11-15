import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { accessToken } = await req.json();

    const res = await fetch(
      "https://control.msg91.com/api/v5/widget/verifyAccessToken",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          authkey: process.env.MSG91_AUTH_KEY,
          "access-token": accessToken,
        }),
      }
    );

    const data = await res.json();

    if (data.type === "success") {
      return NextResponse.json({ success: true, user: data });
    }

    return NextResponse.json(
      { success: false, message: data.message || "Invalid token" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
