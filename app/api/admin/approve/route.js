import connectDB from "@/app/utils/dbconnect";
import student from "@/app/models/student";
import teacher from "@/app/models/teacher";
import nodemailer from "nodemailer";
import supabase from "@/app/lib/supabase";

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

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
    console.log("Received POST body:", body);

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

    // Your existing Supabase logic
    if (role === "student") {
      const { fullname, enrollmentNo, division } = user;
      const { data, error } = await supabase
        .from(`${division}-student`)
        .insert({
          studentname: fullname,
          enroll: enrollmentNo,
        });
      if (error) {
        console.error("Error inserting student data:", error);
        return Response.json(
          {
            success: false,
            error: "Failed to insert student data",
            code: "INSERTION_ERROR",
          },
          { status: 400 }
        );
      }
    }

    // Send email using Nodemailer
    try {
      const mailOptions = {
        from: `"Learnflow" <${process.env.GMAIL_EMAIL}>`,
        to: user.email,
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

      const info = await transporter.sendMail(mailOptions);
      console.log(`Approval email sent to ${user.email}`, info.messageId);
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