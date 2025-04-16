import { NextResponse } from "next/server";
import { createClient } from "redis";

// Create Redis client with connection options
const redisClient = createClient({
  url: "redis://localhost:6379",
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 1000)
  }
});

// Handle Redis connection errors
redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

// Store connection state
let redisConnected = false;

// Ensure Redis connection is established
async function ensureRedisConnection() {
  if (!redisConnected) {
    try {
      await redisClient.connect();
      redisConnected = true;
      console.log("Connected to Redis");
    } catch (err) {
      console.error("Failed to connect to Redis:", err);
      throw new Error("Redis connection failed");
    }
  }
}

export async function POST(request) {
  try {
    // Ensure Redis is connected
    await ensureRedisConnection();
    
    // Parse request body
    const { code, input, languageId } = await request.json();
    
    // Validate required fields
    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }
    
    if (!languageId) {
      return NextResponse.json({ error: "Language ID is required" }, { status: 400 });
    }
    
    // Validate language ID
    const supportedLanguages = [54, 63, 71]; // C++, JavaScript, Python
    if (!supportedLanguages.includes(Number(languageId))) {
      return NextResponse.json({ 
        error: "Unsupported language ID. Supported IDs: 54 (C++), 63 (JavaScript), 71 (Python)" 
      }, { status: 400 });
    }
    
    // Create a unique submission ID with timestamp prefix for better sorting
    const submissionId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    
    // Add submission to Redis queue
    await redisClient.rPush(
      "submission_queue",
      JSON.stringify({
        submissionId,
        code,
        languageId: Number(languageId),
        input: input || "",
      })
    );
    
    console.log(`Submission ${submissionId} added to queue`);
    
    // Wait for the result with timeout
    const timeoutMs = 30000; // 30 seconds timeout
    const startTime = Date.now();
    const pollingInterval = 100; // 100ms between checks
    
    while (Date.now() - startTime < timeoutMs) {
      // Check if there's a result in the queue
      const results = await redisClient.lRange("result_queue", 0, -1);
      
      for (let i = 0; i < results.length; i++) {
        try {
          const result = JSON.parse(results[i]);
          if (result.submissionId === submissionId) {
            // Found our result, remove it from the queue
            await redisClient.lRem("result_queue", 1, results[i]);
            
            console.log(`Result found for submission ${submissionId}`);
            
            return NextResponse.json({
              submissionId,
              output: result.output,
              exitCode: result.exitCode,
              error: result.error
            });
          }
        } catch (e) {
          console.error("Error parsing result:", e);
          // Skip invalid JSON entries
          continue;
        }
      }
      
      // Wait before checking again
      await new Promise(resolve => setTimeout(resolve, pollingInterval));
    }
    
    // If we reach here, the execution timed out
    console.warn(`Execution timed out for submission ${submissionId}`);
    return NextResponse.json(
      { error: "Execution timed out after 30 seconds" },
      { status: 504 }
    );
  } catch (error) {
    console.error("Error processing code execution request:", error);
    
    // Check if Redis connection was lost
    if (!redisConnected || !redisClient.isOpen) {
      redisConnected = false;
      return NextResponse.json(
        { error: "Database connection error. Please try again." },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}