import Submission from "@/app/models/submission";
import connectDB from "@/app/utils/dbconnect";
import Practical from "@/app/models/practicals";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    
    // Get all practicals
    const practicals = await Practical.find().lean();
    
    // If studentId provided, get their submission status for each practical
    if (studentId) {
      const submissions = await Submission.find({ studentId }).lean();
      
      const practicalsWithStatus = practicals.map(practical => {
        const submission = submissions.find(sub => 
          sub.practicalId.toString() === practical._id.toString()
        );
        
        return {
          ...practical,
          status: submission?.status || 'Not Started',
          submissionId: submission?._id
        };
      });
      
      return NextResponse.json(practicalsWithStatus);
    }
    
    return NextResponse.json(practicals);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch practicals" },
      { status: 500 }
    );
  }
}