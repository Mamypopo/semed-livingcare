import { PrismaClient } from "@prisma/client";
import { ENV } from "./env.js";

// Create Prisma client instance
export const prisma = new PrismaClient({
  log: ENV.NODE_ENV === "development" ? ["query", "info", "warn", "error"] : ["error"],
  errorFormat: "pretty",
});

// Database connection function
export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
};

// Graceful shutdown
export const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    console.log("✅ Database disconnected successfully");
  } catch (error) {
    console.error("❌ Database disconnection failed:", error);
  }
};

// Handle process termination
process.on("SIGINT", async () => {
  await disconnectDB();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await disconnectDB();
  process.exit(0);
});

export default prisma;
