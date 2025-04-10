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

    return Response.json({ students, teachers });
  } catch (error) {
    console.error("Error fetching pending users:", error);
    return Response.json(
      { error: "Failed to fetch pending users" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    console.log("Received POST body:", body); // ✅ Debug log

    const { id, role } = body;

    if (!id || !role) {
      return Response.json(
        { error: "Both id and role are required" },
        { status: 400 }
      );
    }

    const Model = role === "student" ? student : teacher;
    const user = await Model.findByIdAndUpdate(
      id,
      { status: "accepted" },
      { new: true }
    );

    if (!user) {
      return Response.json(
        { error: "User not found or already processed" },
        { status: 404 }
      );
    }

    // Send email
    try {
      const msg = {
        to: user.email,
        from: process.env.SENDGRID_FROM_EMAIL || "akshaynazare3@gmail.com",
        subject: "Your Learnflow Account Has Been Approved",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Account Approved</h2>
            <p>Dear ${user.fullname || user.firstName},</p>
            <p>Your Learnflow account has been approved by the administrator.</p>
            <p>You can now log in and access all features.</p>
            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
              <p>Best regards,<br>The Learnflow Team</p>
            </div>
          </div>
        `,
        text: `Your Learnflow account has been approved. You can now log in at ${process.env.NEXTAUTH_URL}`
      };

      await sgMail.send(msg);
      console.log(`Approval email sent to ${user.email}`);
    } catch (emailError) {
      console.error("Error sending approval email:", emailError);
    }

    return Response.json({
      success: true,
      message: "User approved successfully",
      userId: user._id,
      email: user.email
    });
  } catch (error) {
    console.error("Error in approval process:", error);
    return Response.json(
      { error: "Internal server error during approval" },
      { status: 500 }
    );
  }
}
