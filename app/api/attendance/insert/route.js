import supabase from "@/app/lib/supabase";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.updatedRows || !body.date || !body.division) {
      return Response.json(
        {
          error: "Missing required fields",
          message: "updatedRows, date, and division are all required",
        },
        { status: 400 }
      );
    }

    const { updatedRows, date, division } = body;

    const filteredRows = updatedRows.map((stud) => ({
      enroll: stud.EnRoll,
      ispresent: stud.isPresent,
      pracdates: date,
    }));

    // Insert into `attendance`
    const { data, error } = await supabase
      .from(`${division}-attendance`)
      .insert(filteredRows);

    if (error) {
      console.error("Error inserting attendance data:", error);
      return Response.json({ error: "Database insert error" }, { status: 500 });
    }

    return Response.json(
      { message: "Data inserted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Server error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
