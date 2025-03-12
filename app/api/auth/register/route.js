import { NextResponse } from "next/server";
import connectDB from "@/app/utils/dbconnect";
import student from "@/app/models/student";
import teacher from "@/app/models/teacher";


export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    const {
      fullname,
      firstName,
      lastName,
      phoneNumber,
      enrollmentNo,
      division,
      email,
      password,
      role,
      subject
    } = body;

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // 🚫 Block admin registration
    if (role === "admin") {
      return NextResponse.json(
        { error: "Admin registration not allowed" },
        { status: 403 }
      );
    }

    // ✅ Check if user already exists
    const existingUser =
      role === "student"
        ? await student.findOne({ email })
        : await teacher.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }  

    let newUser;
    if (role === "student") {
      if (!fullname || !enrollmentNo || !division) {
        return NextResponse.json(
          { error: "Fullname, Enrollment No and Division are required for students" },
          { status: 400 }
        );
      }

      newUser = new student({
        fullname,
        enrollmentNo,
        division,
        email,
        password,
        role,
        status: "pending", // ⏳ Set status to pending
      });
    } else if (role === "teacher") {
      if (!firstName || !lastName || !phoneNumber || !subject) {
        return NextResponse.json(
          { error: "All teacher fields are required" },
          { status: 400 }
        );
      }

      newUser = new teacher({
        firstName,
        lastName,
        fullname: `${firstName} ${lastName}`, // ✅ Create fullname from firstName + lastName
        phoneNumber,
        email,
        password,
        role,
        subject,
        status: "pending", // ⏳ Set status to pending
      });
    }

    await newUser.save();

    return NextResponse.json(
      { message: "Account created. Awaiting admin approval." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
