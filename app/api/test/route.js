import { NextResponse } from "next/server";
import { createClient } from "redis";

// Create Redis client
const redisClient = createClient({
  url: "redis://localhost:6379",
});

// Handle Redis connection errors
redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

// Connect to Redis (this should be in an initialization function)
let redisConnected = false;
async function ensureRedisConnection() {
  if (!redisConnected) {
    await redisClient.connect();
    redisConnected = true;
    console.log("Connected to Redis");
  }
}

export async function POST(request) {
  try {
    // Ensure Redis is connected
    await ensureRedisConnection();
    
    const { code, input, languageId } = await request.json();

    // Validate input
    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }
    
    if (!languageId) {
      return NextResponse.json({ error: "Language ID is required" }, { status: 400 });
    }

    // Step 1: Add submission to Redis queue
    const submissionId = Date.now().toString() + Math.random().toString(36).substring(2, 15);
    await redisClient.rPush(
      "submission_queue",
      JSON.stringify({
        submissionId,
        code,
        languageId,
        input: input || "",
      })
    );

    // Step 2: Create a unique key for this submission's result
    const resultKey = `result:${submissionId}`;
    
    // Step 3: Wait for the result with timeout
    const timeoutMs = 30000; // 30 seconds timeout
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      // Check if there's a result in the queue
      const results = await redisClient.lRange("result_queue", 0, -1);
      
      for (let i = 0; i < results.length; i++) {
        const result = JSON.parse(results[i]);
        if (result.submissionId === submissionId) {
          // Found our result, remove it from the queue
          await redisClient.lRem("result_queue", 1, results[i]);
          
          return NextResponse.json({ 
            output: result.output,
            exitCode: result.exitCode,
            error: result.error
          });
        }
      }
      
      // Wait a bit before checking again
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // If we reach here, the execution timed out
    return NextResponse.json(
      { error: "Execution timed out" },
      { status: 504 }
    );
  } catch (error) {
    console.error("Error executing code:", error);
    return NextResponse.json(
      { error: "Error executing code: " + error.message },
      { status: 500 }
    );
  }
}