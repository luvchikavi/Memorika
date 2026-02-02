// Prisma configuration file
// Note: DATABASE_URL is optional during install phase (for Vercel builds)
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    // Use DATABASE_URL if available, otherwise use placeholder for build phase
    url: process.env.DATABASE_URL || "postgresql://placeholder:placeholder@localhost:5432/placeholder",
  },
});
