import { NextResponse } from "next/server";
import connectDB from "@/app/utils/dbconnect";
import student from "@/app/models/student";
import teacher from "@/app/models/teacher";
import supabase from "@/app/lib/supabase";

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
      subjects = [], // Default empty array
    } = body;

    // Validate required fields
    if (!email || !password || !role) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          details: {
            email: !email ? "Email is required" : undefined,
            password: !password ? "Password is required" : undefined,
            role: !role ? "Role is required" : undefined,
          },
        },
        { status: 400 }
      );
    }

    // Block admin registration
    if (role === "admin") {
      return NextResponse.json(
        {
          success: false,
          error: "Admin registration is not allowed",
          code: "ADMIN_REGISTRATION_DISABLED",
        },
        { status: 403 }
      );
    }

    // Check if user exists
    const existingUser =
      role === "student"
        ? await student.findOne({ email })
        : await teacher.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "User already exists",
          code: "USER_EXISTS",
          email, // Return the conflicting email
        },
        { status: 409 } // 409 Conflict is more appropriate
      );
    }

    // Handle role-specific validation
    if (role === "student") {
      if (!fullname || !enrollmentNo || !division) {
        return NextResponse.json(
          {
            success: false,
            error: "Student registration incomplete",
            details: {
              fullname: !fullname ? "Full name is required" : undefined,
              enrollmentNo: !enrollmentNo
                ? "Enrollment number is required"
                : undefined,
              division: !division ? "Division is required" : undefined,
            },
          },
          { status: 400 }
        );
      }
    } else if (role === "teacher") {
      if (!firstName || !lastName || !phoneNumber || subjects.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Teacher registration incomplete",
            details: {
              firstName: !firstName ? "First name is required" : undefined,
              lastName: !lastName ? "Last name is required" : undefined,
              phoneNumber: !phoneNumber
                ? "Phone number is required"
                : undefined,
              subjects:
                subjects.length === 0
                  ? "At least one subject is required"
                  : undefined,
            },
          },
          { status: 400 }
        );
      }
    }

    // Create new user
    

    const Model = role === "student" ? student : teacher;
    const newUser = new Model(userData);
    await newUser.save();

    return NextResponse.json(
      {
        success: true,
        message: "Account created. Awaiting admin approval.",
        userId: newUser._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Registration failed",
        code: "INTERNAL_ERROR",
        ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
      },
      { status: 500 }
    );
  }
}
