import supabase from "@/app/lib/supabase";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.date || !body.division) {
      return Response.json(
        {
          error: "Missing required fields",
          message: "Both date and division are required",
        },
        { status: 400 }
      );
    }

    const { date, division } = body;

    // ✅ Fetch attendance data
    const { data: attendanceData, error: attendanceError } = await supabase
      .from("attendance")
      .select("*")
      .eq("pracdates", date)
      .eq("division", division)
      .order("enroll", { ascending: true });

    if (attendanceError) {
      console.error(
        "Attendance query error for date:",
        date,
        "and division:",
        division,
        "Error:",
        attendanceError
      );
      return Response.json(
        {
          error: "Failed to fetch attendance data",
          message: "Error querying attendance records",
          details: attendanceError,
        },
        { status: 500 }
      );
    }

    // ✅ Fetch student data
    const { data: studentData, error: studentError } = await supabase
      .from("students")
      .select("studentname, division, enroll")
      .eq("division", division);

    if (studentError) {
      console.error(
        "Student query error for division:",
        division,
        "Error:",
        studentError
      );
      return Response.json(
        {
          error: "Failed to fetch student data",
          message: "Error querying student records",
          details: studentError,
        },
        { status: 500 }
      );
    }

    // ✅ Combine Results
    const combData = combineResults(studentData, attendanceData || []);

    return Response.json(combData, { status: 200 });
  } catch (error) {
    console.error("Detailed error:", error);
    return Response.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}

// ✅ Helper function to combine results
const combineResults = (studentResults, otherData) => {
  if (otherData.length === 0) {
    return studentResults.map((student, index) => ({
      id: index,
      studentname: student.studentname,
      enroll: student.enroll,
      isPresent: false,
    }));
  } else {
    return otherData.map((attendance, index) => {
      const student = studentResults.find(
        (student) => student.enroll === attendance.enroll
      );
      return {
        id: index,
        studentname: student ? student.studentname : "Unknown",
        enroll: attendance.enroll,
        isPresent: Boolean(attendance.ispresent),
      };
    });
  }
};
