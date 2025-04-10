// app/api/submissions/update/route.js
import connectDB from "@/app/utils/dbconnect";
import Submission from "@/app/models/submission";

export async function PUT(request) {
  try {
    await connectDB();
    const { submissionId, status } = await request.json();

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