import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    // Prisma Migrate needs a direct (non-pooled) connection; DATABASE_URL may be
    // a transaction-pooler URL (e.g. Supabase) that doesn't support migrations.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
