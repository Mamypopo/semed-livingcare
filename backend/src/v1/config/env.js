import dotenvSafe from "dotenv-safe";

dotenvSafe.config({
  example: ".env", 
  allowEmptyValues: false,
});

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  FRONTEND_URL: process.env.FRONTEND_URL ? 
    process.env.FRONTEND_URL.split(',').map(url => url.trim()) : 
    ["http://localhost:3000", "http://localhost:5173"],
  PORT: parseInt(process.env.PORT || "8000", 10),
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  REGISTRATION_CODE: process.env.REGISTRATION_CODE || "DEV888",
};