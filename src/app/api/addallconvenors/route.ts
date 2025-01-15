import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  try {
    return NextResponse.json(
      {
        message: "allconvenors saved successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
