import { NextResponse } from "next/server";
import connectDB from "@/app/utils/dbconnect";
import Practical from "@/app/models/practicals";
import Student from "@/app/models/student";
import nodemailer from "nodemailer";

// Connect to the database
await connectDB();

// Configure Nodemailer with Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD // Use App Password if 2FA enabled
  }
});

// POST: Create new practical and send emails
export async function POST(request) {
  try {
    const { subject, practicalNo, title, description, relatedTheory, tid } = await request.json();

    // Validate required fields
    if (!subject || !practicalNo || !title || !description || !relatedTheory || !tid) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check duplicate
    if (await Practical.findOne({ practicalNo, tid })) {
      return NextResponse.json(
        { success: false, error: `Practical ${practicalNo} already exists` },
        { status: 400 }
      );
    }

    // Save practical
    const newPractical = await Practical.create({
      subject, practicalNo, title, description, relatedTheory, tid,
      createdAt: new Date()
    });

    // Email sending with Nodemailer
    const students = await Student.find({});
    
    // Send emails sequentially to avoid Gmail rate limits
    for (const student of students) {
      try {
        await transporter.sendMail({
          from: `"Learnflow" <${process.env.GMAIL_EMAIL}>`,
          to: student.email,
          subject: `New Practical: ${title}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">New Practical Assignment</h2>
              <p>Dear ${student.name},</p>
              <p>A new practical has been assigned to you:</p>
              <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Practical No:</strong> ${practicalNo}</p>
                <p><strong>Title:</strong> ${title}</p>
                <p><strong>Description:</strong> ${description}</p>
              </div>
              <p>Please log in to your account to complete the practical.</p>
              <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
                <p>Best regards,<br>The Learnflow Team</p>
              </div>
            </div>
          `,
          text: `New Practical: ${title}\n\nDear ${student.name},\n\nA new practical (${subject} - ${practicalNo}) has been assigned to you.\n\nDescription: ${description}\n\nPlease log in to complete it.`
        });
        console.log(`Email sent to ${student.email}`);
      } catch (emailError) {
        console.error(`Failed to send to ${student.email}:`, emailError);
      }
    }

    return NextResponse.json(
      { success: true, data: newPractical },
      { status: 201 }
    );

  } catch (error) {
    console.error("💥 FULL ERROR:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}