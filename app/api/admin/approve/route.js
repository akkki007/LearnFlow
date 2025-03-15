import connectDB from "@/app/utils/dbconnect";
import student from "@/app/models/student";
import teacher from "@/app/models/teacher";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function GET(req) {
  try {
    await connectDB();

    const students = await student.find({ status: "pending" });
    const teachers = await teacher.find({ status: "pending" });

    return new Response(
      JSON.stringify({ students, teachers }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const { id, role } = await req.json();

    let user;
    if (role === "student") {
      user = await student.findById(id);
    } else if (role === "teacher") {
      user = await teacher.findById(id);
    }

    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    user.status = "accepted";
    await user.save();


    // ✅ Send approval email using SendGrid
    const msg = {
      to: user.email,
      from: "akshaynazare3@gmail.com",
      subject: "Account Approved",
      text: `Your account has been approved.`,
      html: `<p>Your account has been approved. You can now login.</p>`,
    };

    await sgMail.send(msg);
    console.log("User approved and notified");
    
    return new Response(
      JSON.stringify({ message: "User approved and notified" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error approving user:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
