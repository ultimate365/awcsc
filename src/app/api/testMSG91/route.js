import { NextResponse } from "next/server";

const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;

export async function GET() {
  try {
    // Test balance endpoint
    const response = await fetch(
      `https://control.msg91.com/api/balance.php?authkey=${MSG91_AUTH_KEY}&type=1`
    );
    const text = await response.text();

    console.log("Balance test response:", text);

    return NextResponse.json({
      authKey: MSG91_AUTH_KEY ? "Present" : "Missing",
      balanceResponse: text,
      status: response.status,
    });
  } catch (error) {
    return NextResponse.json({
      error: error.message,
      authKey: MSG91_AUTH_KEY ? "Present" : "Missing",
    });
  }
}
