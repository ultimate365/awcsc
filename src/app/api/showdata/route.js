import { NextResponse } from "next/server";
import CryptoJS from "crypto-js";
import { secretKey } from "../../../modules/encryption";
export async function POST(request) {
  try {
    const { data, identity } = await request.json();
    // // Get the request body
    const enc = CryptoJS.AES.decrypt(data?.message, secretKey);
    const mainObj = JSON.parse(enc.toString(CryptoJS.enc.Utf8));
    console.log(data);
    console.log(mainObj);
    if (data?.valid) {
      console.log(data);
      return NextResponse.json(
        {
          message: "Message Received successfully",
          success: true,
          data: mainObj,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "Message not found",
          success: false,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error handling POST request:", error);

    // Return an error response
    return NextResponse.json(
      { error: "Failed to process form submission" },
      { status: 500 }
    );
  }
}
