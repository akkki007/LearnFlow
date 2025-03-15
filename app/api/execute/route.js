import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { code, input, languageId } = await request.json();

    // Step 1: Submit code to Judge0
    const submissionResponse = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions",
      {
        source_code: code,
        language_id: languageId, // Use the selected language ID
        stdin: input,
      },
      {
        headers: {
          "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          "Content-Type": "application/json",
        },
      }
    );

    const submissionToken = submissionResponse.data.token;

    // Step 2: Poll for execution result
    let resultResponse;
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      resultResponse = await axios.get(
        `https://judge0-ce.p.rapidapi.com/submissions/${submissionToken}`,
        {
          headers: {
            "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      );

      if (resultResponse.data.status.id > 2) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      attempts++;
    }

    // Step 3: Return the result
    if (resultResponse.data.status.id === 3) {
      // Successful execution
      return NextResponse.json({ output: resultResponse.data.stdout });
    } else if (resultResponse.data.status.id === 6) {
      // Compilation error
      return NextResponse.json({ output: resultResponse.data.compile_output });
    } else {
      // Runtime error or other issues
      return NextResponse.json({ output: resultResponse.data.stderr });
    }
  } catch (error) {
    console.error("Error executing code:", error);
    return NextResponse.json(
      { error: "Error executing code" },
      { status: 500 }
    );
  }
}