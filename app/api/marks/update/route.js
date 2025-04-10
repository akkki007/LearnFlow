import supabase from "@/app/lib/supabase";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.division || !body.subject || !body.marks) {
      return Response.json(
        {
          error: "Missing required fields",
          message: "Division, subject, and marks data are required",
        },
        { status: 400 }
      );
    }

    const { division, subject, marks } = body;

    const updatePromises = marks.map(async (row) => {
      const { id, enroll, studentname, subject, division, ...scores } = row;
      console.log(scores);

      Object.keys(scores).forEach((key) => {
        scores[key] = Number(scores[key]) || 0;
      });

      // Update the marks
      const { error } = await supabase
        .from("student_marks")
        .update(scores)
        .eq("enroll", enroll)
        .eq("division", division)
        .eq("subject", subject);

      if (error) {
        console.error(`Error updating marks for ${enroll}:`, error);
        throw error;
      }
    });

    await Promise.all(updatePromises);

    return Response.json(
      { message: "Marks updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating marks:", error);
    return Response.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}
