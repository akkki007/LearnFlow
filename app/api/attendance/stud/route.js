import supabase from "@/app/lib/supabase";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.division) {
      return Response.json(
        {
          error: "Missing required field",
          message: "Division is required",
        },
        { status: 400 }
      );
    }

    const { division } = body;

    // ✅ Fetch student data
    const { data, error } = await supabase
      .from("students")
      .select("studentname, enroll")
      .eq("division", division);

    if (error) {
      console.error(
        "Error fetching students for division:",
        division,
        "Error:",
        error
      );
      return Response.json(
        {
          error: "Failed to fetch student list",
          message: "Error querying student records",
          details: error,
        },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      console.log("No student data found");
      return Response.json({ user: [] }, { status: 200 });
    }

    // ✅ Format the data
    const formattedData = data.map((student) => ({
      Name: student.studentname,
      EnRoll: student.enroll,
    }));
    console.log("Formatted student data:", formattedData);
    return Response.json({ user: formattedData }, { status: 200 });
  } catch (error) {
    console.error("Server error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
