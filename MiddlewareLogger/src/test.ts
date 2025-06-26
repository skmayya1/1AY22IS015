import { Log } from "./Logger";

async function testLogger() {
  console.log("Testing logger with different parameter formats...\n");

  try {
    console.log("Test 1: String literals");
    await Log({
      stack: "backend",
      level: "info",
      package: "service",
      message: "Test message with string literals"
    });
  } catch (error) {
    console.error("Test 1 failed:", error);
  }

  try {
    console.log("\nTest 2: Using variables");
    const logParams = {
      stack: "frontend" as const,
      level: "warn" as const,
      package: "component" as const,
      message: "Test message with variables"
    };
    await Log(logParams);
  } catch (error) {
    console.error("Test 2 failed:", error);
  }

  try {
    console.log("\nTest 3: Mixed approach");
    const stack = "backend";
    const level = "error";
    const pkg = "controller";
    
    await Log({
      stack: stack as "backend" | "frontend",
      level: level as "debug" | "info" | "warn" | "error" | "fatal",
      package: pkg as any, 
      message: "Test message with mixed approach"
    });
  } catch (error) {
    console.error("Test 3 failed:", error);
  }
}

testLogger().then(() => {
  console.log("\nAll tests completed!");
}).catch(console.error);
