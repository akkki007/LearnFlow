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

    const promises = updatedRows.map(async (row) => {
      const isPresent = row.isPresent ? true : false;

      const { data, error } = await supabase
        .from(`${division}-attendance`)
        .select("*")
        .eq("enroll", row.EnRoll)
        .eq("pracdates", date);

      if (error) throw error;

      if (data && data.length > 0) {
        return supabase
          .from(`${division}-attendance`)
          .update({ ispresent: isPresent })
          .eq("enroll", row.EnRoll)
          .eq("pracdates", date);
      }
    });

    const results = await Promise.all(promises);
    const errors = results.filter((result) => result.error);

    if (errors.length > 0) {
      console.error("Errors updating rows:", errors);
      return Response.json(
        { error: "Database update error", details: errors },
        { status: 500 }
      );
    }

    return Response.json(
      { message: "All updates processed successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating data:", error);
    return Response.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}
