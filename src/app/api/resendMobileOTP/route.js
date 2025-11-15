import { NextResponse } from "next/server";

const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;

export async function POST(request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({
        success: false,
        message: "Phone number is required",
      });
    }

    console.log("Resending OTP to:", phone);

    const formData = new URLSearchParams();
    formData.append("authkey", MSG91_AUTH_KEY);
    formData.append("mobile", `91${phone}`);
    formData.append("retrytype", "text");

    const response = await fetch("https://control.msg91.com/api/retryotp.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    const responseText = await response.text();
    console.log("Raw resend response:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse resend response as JSON:", parseError);

      if (
        responseText.includes("<!DOCTYPE") ||
        responseText.includes("<html")
      ) {
        return NextResponse.json({
          success: false,
          message: "MSG91 service unavailable. Please try again later.",
        });
      }

      return NextResponse.json({
        success: false,
        message: `Invalid resend response: ${responseText.substring(0, 100)}`,
      });
    }

    console.log("Parsed resend data:", data);

    if (
      data.type === "success" ||
      data.message?.toLowerCase().includes("sent")
    ) {
      return NextResponse.json({
        success: true,
        message: "OTP resent successfully",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: data.message || "Failed to resend OTP",
      });
    }
  } catch (error) {
    console.error("Error resending OTP:", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
}
