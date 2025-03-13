import supabase from "@/app/lib/supabase";

export async function POST(req) {
  try {
    const { data, error } = await supabase
      .from("daterecord")
      .select("*")
      .order("pracdates", { ascending: false });

    if (error) {
      console.error("Error fetching date records. Error:", error);
      return Response.json(
        {
          error: "Failed to load date records",
          message: "Error querying date records",
          details: error,
        },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      console.log("No date records found");
      return Response.json({ user: [] }, { status: 200 });
    }

    return Response.json({ user: data }, { status: 200 });
  } catch (error) {
    console.error("Server error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
