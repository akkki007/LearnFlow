import { createClient } from "redis";
import Docker from "dockerode";
import { writeFileSync, mkdirSync, rmSync, existsSync } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
const { posix } = path;
// Create Redis client
const redisClient = createClient({ url: "redis://localhost:6379" });
redisClient.on("error", (err) => console.error("Redis error:", err));

// Create Docker client
const docker = new Docker();

const languageConfigs = {
  71: { // Python
    image: "python:3.9-slim",
    runCommand: (filename) => `python ${filename}`,
    extension: ".py"
  },
  63: { // JavaScript
    image: "node:16-slim",
    runCommand: (filename) => `node ${filename}`,
    extension: ".js"
  },
  54: { // C++
    image: "gcc:latest",
    runCommand: (filename) => `g++ ${filename} -o /tmp/output && /tmp/output`,
    extension: ".cpp"
  },
};

// ✅ Function to pull Docker image if not available
async function ensureImageExists(imageName) {
  const images = await docker.listImages();
  const exists = images.some(img =>
    img.RepoTags && img.RepoTags.includes(imageName)
  );

  if (!exists) {
    console.log(`Pulling image: ${imageName}`);
    await new Promise((resolve, reject) => {
      docker.pull(imageName, (err, stream) => {
        if (err) return reject(err);

        docker.modem.followProgress(stream, (err) => {
          if (err) return reject(err);
          console.log(`Image ${imageName} pulled successfully`);
          resolve(true);
        });
      });
    });
  }
}

// ✅ Code Execution Function
async function executeCode(submissionId, code, languageId, input) {
  console.log(`Executing code for submission ${submissionId}`);

  const config = languageConfigs[languageId];
  if (!config) {
    return { submissionId, output: "Unsupported language", error: true };
  }

  // ✅ Fix Path Issue: Use `path.resolve()` and convert Windows `\` to `/`
  let tempDir = path.resolve("/tmp", `code-${submissionId}-${uuidv4()}`);
  tempDir = tempDir.replace(/\\/g, '/'); // Convert to Linux-style path

  console.log(`Creating tempDir: ${tempDir}`);
  
  mkdirSync(tempDir, { recursive: true });

  try {
    // ✅ Write code to file
    const filename = `code${config.extension}`;
    // After writing the file
const filepath = posix.join(tempDir, filename);
writeFileSync(filepath, code);

// Log the file path and check if it exists
console.log(`File written to: ${filepath}`);

    // ✅ Write input to file (if provided)
    if (input) {
      const inputFile = `${tempDir}/input.txt`;
      writeFileSync(inputFile, input);
    }

    // ✅ Ensure Docker image exists
    await ensureImageExists(config.image);

    // ✅ Prepare execution command
    const execCommand = config.runCommand(`/app/${filename}`);
    const inputRedirect = input ? ` < /app/input.txt` : "";
    const fullCommand = `${execCommand}${inputRedirect}`;

    console.log(`Running command: ${fullCommand}`);

    // ✅ Create Docker container
    const container = await docker.createContainer({
      Image: config.image,
      Cmd: ["sh", "-c", fullCommand],
      Tty: true,
      HostConfig: {
        Memory: 100 * 1024 * 1024, // 100 MB memory limit
        NetworkMode: "none", // No network access
        Binds: [`${tempDir}:/app`], // ✅ Fix for mounting issue
      },
    });

    // ✅ Start container
    await container.start();

    // ✅ Capture container output
    let output = "";
    const stream = await container.attach({
      stream: true,
      stdout: true,
      stderr: true,
    });

    stream.on("data", (chunk) => {
      output += chunk.toString();
    });

    // ✅ Polling with `inspect()` to track container status
    const checkContainerStatus = async () => {
      while (true) {
        const containerInfo = await container.inspect();
        if (!containerInfo.State.Running) {
          console.log(`Container exited with code ${containerInfo.State.ExitCode}`);

          if (!output) {
            const logs = await container.logs({ stdout: true, stderr: true });
            output = logs.toString();
          }

          await container.remove();

          return {
            submissionId,
            output: output || `No output. Exit code: ${containerInfo.State.ExitCode}`,
            exitCode: containerInfo.State.ExitCode,
          };
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    };

    // ✅ Start polling
    return await checkContainerStatus();

  } catch (error) {
    console.error("Execution error:", error);
    return {
      submissionId,
      output: `Execution error: ${error.message}`,
      error: true
    };
  } finally {
    // ✅ Clean up temp directory
    try {
      rmSync(tempDir, { recursive: true, force: true });
    } catch (err) {
      console.error("Error removing temp directory:", err);
    }
  }
}

// ✅ Worker function to listen to Redis
async function worker() {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");

    while (true) {
      try {
        console.log("Waiting for submissions...");
        const result = await redisClient.blPop("submission_queue", 0);

        if (result) {
          const data = JSON.parse(result.element);
          console.log(`Processing submission: ${data.submissionId}`);

          const executionResult = await executeCode(
            data.submissionId,
            data.code,
            data.languageId,
            data.input
          );

          console.log(`Execution completed for submission: ${data.submissionId}`);

          // ✅ Push result back to Redis
          await redisClient.rPush("result_queue", JSON.stringify(executionResult));
        }
      } catch (err) {
        console.error("Error processing submission:", err);
      }
    }
  } catch (err) {
    console.error("Worker initialization error:", err);
  }
}

// ✅ Start worker
worker();
