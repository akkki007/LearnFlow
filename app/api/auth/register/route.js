import connectDB from "@/app/utils/dbconnect";
import student from "@/app/models/student";
import teacher from "@/app/models/teacher";
import bcrypt from "bcrypt";

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
      return Response.json(
        { error: "All fields are required" },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 🚫 Block admin registration
    if (role === "admin") {
      return Response.json(
        { error: "Admin registration not allowed" },
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // ✅ Check if user already exists
    const existingUser =
      role === "student"
        ? await student.findOne({ email })
        : await teacher.findOne({ email });

    if (existingUser) {
      return Response.json(
        { error: "User already exists" },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;
    if (role === "student") {
      if (!fullname || !enrollmentNo || !division) {
        return Response.json(
          { error: "Fullname, Enrollment No and Division are required for students" },
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      newUser = new student({
        fullname,
        enrollmentNo,
        division,
        email,
        password: hashedPassword,
        role, // ✅ Add role for students
        status: "pending", // ⏳ Set status to pending
      });
    } else if (role === "teacher") {
      if (!firstName || !lastName || !phoneNumber || !subject) {
        return Response.json(
          { error: "All teacher fields are required" },
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      newUser = new teacher({
        firstName,
        lastName,
        fullname: `${firstName} ${lastName}`, // ✅ Create fullname from firstName + lastName
        phoneNumber,
        email,
        password: hashedPassword,
        role,
        subject,
        status: "pending", // ⏳ Set status to pending
      });
    }

    await newUser.save();

    return Response.json(
      { message: "Account created. Awaiting admin approval." },
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error during registration:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
