import { NextResponse } from "next/server";
import connectDB from "@/app/utils/dbconnect";
import Practical from "@/app/models/practicals";
import Student from "@/app/models/student";

// Connect to the database
await connectDB();

// Configure SendGrid
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// GET: Fetch all practicals
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tid = searchParams.get('tid');
    
    if (!tid) {
      return NextResponse.json(
        { error: "Teacher ID (tid) is required" },
        { status: 400 }
      );
    }

    const practicals = await Practical.find({ tid });
    
    return NextResponse.json({
      success: true,
      data: practicals
    });

  } catch (error) {
    console.error("Error fetching practicals:", error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || "Failed to fetch practicals" 
      },
      { status: 500 }
    );
  }
}

// POST: Create a new practical with email notifications
export async function POST(request) {
  try {
    const requestBody = await request.json();
    const { subject, practicalNo, title, description, relatedTheory, tid } = requestBody;

    // Validate required fields
    const missingFields = [];
    if (!subject) missingFields.push('subject');
    if (!practicalNo) missingFields.push('practicalNo');
    if (!title) missingFields.push('title');
    if (!description) missingFields.push('description');
    if (!relatedTheory) missingFields.push('relatedTheory');
    if (!tid) missingFields.push('tid');

    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false,
          error: "Missing required fields",
          missingFields 
        },
        { status: 400 }
      );
    }

    // Check for duplicate practical number
    const existingPractical = await Practical.findOne({ 
      practicalNo,
      tid 
    });

    if (existingPractical) {
      return NextResponse.json(
        { 
          success: false,
          error: `Practical number ${practicalNo} already exists for this teacher` 
        },
        { status: 400 }
      );
    }

    // Create new practical
    const newPractical = new Practical({
      subject,
      practicalNo,
      title,
      description,
      relatedTheory,
      tid,
      createdAt: new Date()
    });

    await newPractical.save();

    // Send email notifications to all students (non-blocking)
    try {
      const students = await Student.find({});
      const msg = {
        from: {
          email: process.env.SENDGRID_FROM_EMAIL || 'noreply@learnflow.com',
          name: 'Learnflow'
        },
        subject: `New Practical: ${title}`,
        text: `A new practical has been assigned:\n\nSubject: ${subject}\nPractical No: ${practicalNo}\nTitle: ${title}\n\nDescription: ${description}\n\nPlease login to complete it.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">New Practical Assignment</h2>
            <p>Dear Student,</p>
            <p>A new practical has been assigned to you:</p>
            <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Practical No:</strong> ${practicalNo}</p>
              <p><strong>Title:</strong> ${title}</p>
              <p><strong>Description:</strong> ${description}</p>
            </div>
            <p>Please log in to your AcademyHub account to view and complete the practical.</p>
            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
              <p>Best regards,<br>The AcademyHub Team</p>
            </div>
          </div>
        `,
        personalizations: students.map(student => ({
          to: student.email,
          dynamic_template_data: {
            student_name: student.name,
            subject,
            practicalNo,
            title,
            description
          }
        }))
      };

      // Send emails in background
      sgMail.sendMultiple(msg).then(() => {
        console.log(`Emails sent to ${students.length} students`);
      }).catch(error => {
        console.error('Error sending emails:', error.response?.body || error.message);
      });
    } catch (emailError) {
      console.error("Error preparing emails:", emailError);
    }

    return NextResponse.json(
      {
        success: true,
        data: newPractical
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating practical:", error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || "Failed to create practical" 
      },
      { status: 500 }
    );
  }
}