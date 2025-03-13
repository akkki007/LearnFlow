import supabase from "@/app/lib/supabase";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.updatedRows || !body.date || !body.div) {
      return Response.json(
        {
          error: "Missing required fields",
          message: "updatedRows, date, and div are all required",
        },
        { status: 400 }
      );
    }

    const { updatedRows, date, div } = body;

    const filteredRows = updatedRows.map((stud) => ({
      enroll: stud.EnRoll,
      ispresent: stud.isPresent,
      division: div,
      pracdates: date,
    }));

    // Insert into `attendance`
    const { data, error } = await supabase
      .from("attendance")
      .insert(filteredRows);

    if (error) {
      console.error("Error inserting attendance data:", error);
      return Response.json({ error: "Database insert error" }, { status: 500 });
    }

    // Insert into `daterecord`
    const { data: dateData, error: dateError } = await supabase
      .from("daterecord")
      .insert([{ division: div, pracdates: date }]);

    if (dateError) {
      console.error("Error inserting date record:", dateError);
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
