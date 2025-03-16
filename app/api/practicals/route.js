import { NextResponse } from "next/server";
import connectDB from "@/app/utils/dbconnect";
import Practical from "@/app/models/practicals"; // Import the Practical model

// Connect to the database
await connectDB();

// GET: Fetch all practicals
export async function GET() {
  try {
    const practicals = await Practical.find({}); // Fetch all practicals from the database
    return NextResponse.json(practicals); // Return the practicals as JSON
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch practicals" },
      { status: 500 }
    );
  }
}

// POST: Create a new practical
export async function POST(request) {
  try {
    const { subject, practicalNo, title, description, relatedTheory } =
      await request.json(); // Parse the request body

    // Validate required fields
    if (!subject || !practicalNo || !title || !description || !relatedTheory) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if the practical number already exists
    const existingPractical = await Practical.findOne({ practicalNo });
    if (existingPractical) {
      return NextResponse.json(
        { error: "Practical number must be unique" },
        { status: 400 }
      );
    }

    // Create a new practical
    const newPractical = new Practical({
      subject,
      practicalNo,
      title,
      description,
      relatedTheory,
    });

    await newPractical.save(); // Save the practical to the database
    return NextResponse.json(newPractical, { status: 201 }); // Return the created practical
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create practical" },
      { status: 500 }
    );
  }
}