import { Logger } from "./types";

export async function Log({ stack, level, package: pkg, message }: Logger) {
  const access_token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJza2FuZGFtYXl5YTRAZ21haWwuY29tIiwiZXhwIjoxNzUwOTIyNjk1LCJpYXQiOjE3NTA5MjE3OTUsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIxMzAzYTgwYy04ZmUwLTRlOGItOTZjZi1jNjk1ZGI3MzczMzAiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJza2FuZGEgbWF5eWEiLCJzdWIiOiI5Yzg4NzU1MC1kYmYwLTRkMzktOTNiNC0yYmU3ZjY1ZTYzMzQifSwiZW1haWwiOiJza2FuZGFtYXl5YTRAZ21haWwuY29tIiwibmFtZSI6InNrYW5kYSBtYXl5YSIsInJvbGxObyI6IjFheTIyaXMwMTUiLCJhY2Nlc3NDb2RlIjoieHRCU3FNIiwiY2xpZW50SUQiOiI5Yzg4NzU1MC1kYmYwLTRkMzktOTNiNC0yYmU3ZjY1ZTYzMzQiLCJjbGllbnRTZWNyZXQiOiJtd0Z6TUdUdE5jSHZtQnVVIn0.Su0utwzRdTbPXRERohpLlbd1LYXPd31voxPO2FceDBo";
    
  console.log("Logging parameters received:", {
    stack,
    level,
    package: pkg,
    message,
  });

  if (!stack || !level || !pkg || !message) {
    console.error("Missing required parameters:", { stack, level, pkg, message });
    throw new Error("Invalid logger parameters - all fields are required");
  }

  const payload = {
    stack: String(stack),
    level: String(level),
    package: String(pkg),
    message: String(message),
  };

  console.log("Payload being sent:", payload);

  try {
    const res = await fetch("http://20.244.56.144/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(payload),
    });

    console.log("Response status:", res.status);
    
    const data = await res.json();
    
    if (!res.ok) {
      console.error("Log API error:", data);
      throw new Error(`Error logging: ${data.message || 'Unknown error'}`);
    }

    console.log("Log response:", data);
    return data;
    
  } catch (error) {
    console.error("Failed to send log:", error);

    console.error("Local fallback log:", payload);
  }
  

}
