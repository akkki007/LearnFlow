import connectDB from "@/app/utils/dbconnect";
import student from "@/app/models/student";
import teacher from "@/app/models/teacher";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function POST(req) {
  await connectDB();

  const { email, password, role } = await req.json();

  if (!email || !password || !role) {
    return new Response(
      JSON.stringify({ error: "All fields are required" }),
      { status: 400 }
    );
  }

  let user;

  // ✅ Student login
  if (role === "student") {
    user = await student.findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found. Please register" }),
        { status: 404 }
      );
    }
    if (user.status !== "accepted") {
      return new Response(
        JSON.stringify({ error: "Account not approved yet" }),
        { status: 403 }
      );
    }
  } 
  // ✅ Teacher login
  else if (role === "teacher") {
    user = await teacher.findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found. Please register" }),
        { status: 404 }
      );
    }
    if (user.status !== "accepted") {
      return new Response(
        JSON.stringify({ error: "Account not approved yet" }),
        { status: 403 }
      );
    }
  } 
  // ✅ Admin login
  else if (role === "admin") {
    if (
      email !== process.env.ADMIN_EMAIL || 
      password !== process.env.ADMIN_PASSWORD
    ) {
      return new Response(
        JSON.stringify({ error: "Invalid admin credentials" }),
        { status: 401 }
      );
    }
    
    // Create admin user object for token generation
    user = { _id: "admin", role: "admin" };
  }

  // ✅ If user is still not found at this point, return an error
  if (!user) {
    return new Response(
      JSON.stringify({ error: "Invalid credentials" }),
      { status: 401 }
    );
  }

  // ✅ Password verification for student/teacher
  if (role !== "admin") {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(
        JSON.stringify({ error: "Invalid credentials" }),
        { status: 401 }
      );
    }
  }

  // ✅ Create JWT token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return new Response(
    JSON.stringify({
      message: "Login successful",
      token,
      role: user.role,
    }),
    { status: 200 }
  );
}
