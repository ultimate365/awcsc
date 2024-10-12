import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/userteachers";
import School from "../../../models/userschools";
import Teacher from "../../../models/teachers";
import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcryptjs";

dbConnect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, password }: any = reqBody;
    const userteacherData = await User.findOne({ username });
    const schoolData = await School.findOne({ username });
    if (userteacherData) {
      if (!userteacherData.disabled) {
        const teacherData = await Teacher.findOne({ id: userteacherData.id });
        const matchPassword = bcrypt.compareSync(
          password,
          userteacherData.password
        );
        if (matchPassword) {
          return NextResponse.json(
            {
              message: "Please login to your account.",
              success: true,
              userteacherData: userteacherData,
              teacherData: teacherData,
              type: "teacher",
            },
            { status: 200 }
          );
        } else {
          return NextResponse.json(
            {
              message: "Incorrect password",
              success: false,
            },
            { status: 200 }
          );
        }
      } else {
        return NextResponse.json(
          {
            message: "Your account has been disabled.",
            success: false,
          },
          { status: 200 }
        );
      }
    } else if (schoolData) {
      const matchPassword = bcrypt.compareSync(password, schoolData.password);
      if (matchPassword) {
        return NextResponse.json(
          {
            message: "Please login to your account.",
            success: true,
            userschoolData: schoolData,
            type: "school",
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          {
            message: "Incorrect password",
            success: false,
          },
          { status: 200 }
        );
      }
    } else {
      return NextResponse.json(
        {
          message: "Cannot Find a teacher or school",
          success: false,
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
