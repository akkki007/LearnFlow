import { NextResponse } from "next/server";
import connectDB from "@/app/utils/dbconnect";
import Student from "@/app/models/student";
import Teacher from "@/app/models/teacher";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB(); // Connect to the database
  } catch (error) {
    console.error("Database connection failed:", error);
    return NextResponse.json(
      { error: "Database connection failed" },
      { status: 500 }
    );
  }

  try {
    const { email, password, role } = await req.json();

    // Validate required fields
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    let user;

    // ✅ Student login
    if (role === "student") {
      user = await Student.findOne({ email: email.toLowerCase() });
      if (!user) {
        return NextResponse.json(
          { error: "User not found. Please register." },
          { status: 404 }
        );
      }
      if (user.status !== "accepted") {
        return NextResponse.json(
          { error: "Account not approved yet." },
          { status: 403 }
        );
      }
    }
    // ✅ Teacher login
    else if (role === "teacher") {
      user = await Teacher.findOne({ email: email.toLowerCase() });
      if (!user) {
        return NextResponse.json(
          { error: "User not found. Please register." },
          { status: 404 }
        );
      }
      if (user.status !== "accepted") {
        return NextResponse.json(
          { error: "Account not approved yet." },
          { status: 403 }
        );
      }
    }
    // ✅ Admin login
    else if (role === "admin") {
      if (
        email.toLowerCase() !== process.env.ADMIN_EMAIL.toLowerCase() ||
        password !== process.env.ADMIN_PASSWORD
      ) {
        return NextResponse.json(
          { error: "Invalid admin credentials." },
          { status: 401 }
        );
      }

      // ✅ Create admin token directly
      const token = jwt.sign(
        { id: "admin", role: "admin", email: process.env.ADMIN_EMAIL }, // Include email for admin
        "kdidiee32",
        { expiresIn: "1d" }
      );

      return NextResponse.json(
        { message: "Login successful", token, role: "admin" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Invalid role specified." },
        { status: 400 }
      );
    }

    // ✅ Compare passwords using the schema method
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    // ✅ Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email }, // Include email in the payload
      "kdidiee32",
      { expiresIn: "1d" }
    );

    return NextResponse.json(
      {
        message: "Login successful",
        token,
        role: user.role,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}