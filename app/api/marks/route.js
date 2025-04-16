import supabase from "@/app/lib/supabase";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.division || !body.subject) {
      return Response.json(
        {
          error: "Missing required fields",
          message: "Both division and subject are required",
        },
        { status: 400 }
      );
    }

    const { division, subject } = body;

    // Fetch marks data
    const { data: marksData, error: marksError } = await supabase
      .from(`${division}-marks`)
      .select("*")
      .eq("division", division)
      .order("enroll", { ascending: true });

    if (marksError) {
      console.error(
        "Marks query error for division:",
        division,
        "and subject:",
        subject,
        "Error:",
        marksError
      );
      return Response.json(
        {
          error: "Failed to fetch marks data",
          message: "Error querying student marks",
          details: marksError,
        },
        { status: 500 }
      );
    }

    if (marksData.length === 0) {
      return Response.json({ message: "No Rows Found" }, { status: 200 });
    }

    // Fetch student names
    const { data: students, error: studentError } = await supabase
      .from(`${division}-student`)
      .select("studentname")
      .order("enroll", { ascending: true });

    if (studentError) {
      console.error(
        "Students query error for division:",
        division,
        "Error:",
        studentError
      );
      return Response.json(
        {
          error: "Failed to fetch student names",
          message: "Error querying student records",
          details: studentError,
        },
        { status: 500 }
      );
    }

    for (let index = 0; index < students.length; index++) {
      if (marksData[index]) {
        marksData[index].id = index;
        marksData[index].studentname = students[index].studentname;
      }
    }
    //console.log(marksData);

    return Response.json(marksData, { status: 200 });
  } catch (error) {
    console.error("Detailed error:", error);
    return Response.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}
