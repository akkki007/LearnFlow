// app/api/submissions/update/route.js
import connectDB from "@/app/utils/dbconnect";
import Submission from "@/app/models/submission";
import nodemailer from "nodemailer";

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

export async function PUT(request) {
  try {
    await connectDB();
    const { submissionId, status } = await request.json();

    // Update submission and populate related data
    const updatedSubmission = await Submission.findByIdAndUpdate(
      submissionId,
      { status },
      { new: true }
    ).populate("studentId practicalId");

    if (!updatedSubmission) {
      return new Response(JSON.stringify({ error: "Submission not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Send email notification (non-blocking)
    try {
      const student = updatedSubmission.studentId;
      const practical = updatedSubmission.practicalId;
      
      const statusMessages = {
        'Completed': 'has been approved',
        'Issue': 'needs corrections',
        'Pending': 'is being reviewed'
      };

      const statusColors = {
        'Completed': '#10b981',
        'Issue': '#ef4444',
        'Pending': '#f59e0b'
      };

      const mailOptions = {
        from: `"Learnflow" <${process.env.GMAIL_EMAIL}>`,
        to: student.email,
        subject: `Submission Update: Practical ${practical.practicalNo}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Submission Status Updated</h2>
            <p>Dear ${student.fullname || student.name},</p>
            <p>Your submission for <strong>Practical ${practical.practicalNo}: ${practical.title}</strong> ${statusMessages[status] || 'has been updated'}.</p>
            
            <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p><strong>Status:</strong> <span style="color: ${statusColors[status]}">${status}</span></p>
              ${status === 'Issue' ? `
                <p><strong>Feedback:</strong> Please review the comments and resubmit your work.</p>
              ` : ''}
            </div>

            <p>You can view the details in your Learnflow dashboard.</p>
            
            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
              <p>Best regards,<br>The Learnflow Team</p>
            </div>
          </div>
        `,
        text: `Your submission for Practical ${practical.practicalNo}: ${practical.title} has been updated to status: ${status}.\n\n`
              + (status === 'Issue' ? 'Feedback: Please review the comments and resubmit your work.\n\n' : '')
              + 'You can view the details in your Learnflow dashboard.'
      };

      // Send email without waiting for response
      transporter.sendMail(mailOptions)
        .then(info => console.log(`Email sent to ${student.email}:`, info.messageId))
        .catch(error => console.error('Error sending email:', error));

    } catch (emailError) {
      console.error("Error preparing email notification:", emailError);
    }

    return new Response(JSON.stringify(updatedSubmission), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error updating submission:", error);
    return new Response(JSON.stringify({ error: "Error updating submission" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}