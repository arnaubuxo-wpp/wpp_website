// Thin wrapper around the Neon serverless driver. Vercel's Postgres (Neon)
// storage integration injects DATABASE_URL (pooled) automatically into every
// environment (Production, Preview, Development) once the integration is
// connected to the project — no manual .env wiring needed on Vercel itself.
import { neon } from "@neondatabase/serverless";

let cached: ReturnType<typeof neon> | null = null;

export function sql() {
  if (!cached) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        "DATABASE_URL is not set. Add the Neon/Postgres integration env vars in Vercel project settings."
      );
    }
    cached = neon(url);
  }
  return cached;
}
