import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/lib/server/drizzleOut",
  schema: "./src/lib/server/schemas.ts",
  dialect: "postgresql",
  dbCredentials: {
    // @ts-ignore drizzle-kit will load the env.
    url: process.env.DATABASE_URL!,
  },
});
