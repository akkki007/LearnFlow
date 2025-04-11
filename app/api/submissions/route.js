// app/api/submissions/route.js
import connectDB from "@/app/utils/dbconnect";
import Submission from "@/app/models/submission";
import Practical from "@/app/models/practicals";
import Student from "@/app/models/student";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();
    const { code, practicalNo, language, userId } = await request.json();
    
    // Validate student exists
    const student = await Student.findById(userId);
    if (!student) {
      console.error("Student not found:", userId);
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    const practical = await Practical.findOne({ practicalNo });
    if (!practical) {
      console.error("Practical not found:", practicalNo);
      return NextResponse.json(
        { error: "Practical not found" },
        { status: 404 }
      );
    }
    
    // Check for existing submission
    const existingSubmission = await Submission.findOne({
      studentId: userId,
      practicalId: practical._id
    });
    
    if (existingSubmission) {
      return NextResponse.json(
        { error: "You've already submitted this practical" },
        { status: 400 }
      );
    }
    
    // Create and save new submission
    const newSubmission = new Submission({
      studentId: userId,
      practicalId: practical._id,
      status: "Pending",
      code,
      language
    });
    
    const savedSubmission = await newSubmission.save();
    
    // Update student's practicals (simplified)
    await Student.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          practicals: {
            practicalId: practical._id,
            status: "completed",
            completedAt: new Date()
          }
        }
      },
      { new: true }
    );
    
    return NextResponse.json(
      {
        message: "Practical submitted successfully",
        submission: savedSubmission
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { error: `Failed to submit practical: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const practicalNo = searchParams.get('practicalNo');
    const status = searchParams.get('status');
    
    let query = {};
    
    if (practicalNo) {
      const practical = await Practical.findOne({ practicalNo });
      if (!practical) {
        return NextResponse.json(
          { error: "Practical not found" },
          { status: 404 }
        );
      }
      query.practicalId = practical._id;
    }
    
    if (status && status !== "") {
      query.status = status;
    }
    
    try {
      const submissions = await Submission.find(query)
        .populate({
          path: 'studentId',
          select: 'fullname enrollmentNo email',
          model: Student
        })
        .populate({
          path: 'practicalId',
          select: 'practicalNo title',
          model: Practical
        })
        .sort({ createdAt: -1 })
        .lean();
      
      if (!submissions) {
        return NextResponse.json(
          { submissions: [] },
          { status: 200 }
        );
      }
      
      return NextResponse.json(
        { submissions },
        { status: 200 }
      );
    } catch (dbError) {
      console.error("Database query error:", dbError);
      return NextResponse.json(
        { error: `Database query failed: ${dbError.message}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Fetch submissions error:", error);
    return NextResponse.json(
      { error: `Failed to fetch submissions: ${error.message}` },
      { status: 500 }
    );
  }
}