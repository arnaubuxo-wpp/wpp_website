import { NextResponse } from "next/server";
import { createEnquiry, hashIp, recentCountForIp } from "@/lib/wpp/enquiries-server";
import { validateEnquiry, type EnquiryInput } from "@/lib/wpp/enquiries-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Max submissions accepted from one IP hash per hour. */
const HOURLY_LIMIT = 5;
/** A human cannot fill this form in under this long; a bot posts instantly. */
const MIN_FILL_MS = 2500;

function clientIp(request: Request): string | null {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip");
}

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // --- Spam gates -----------------------------------------------------------
  // Both respond with a normal success shape rather than an error: telling a bot
  // precisely which check caught it just helps it try again differently, and a
  // false positive on a real person is then at least not a visible failure.
  const honeypot = str(body.website).trim();
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  const elapsed = Number(body.elapsedMs);
  if (Number.isFinite(elapsed) && elapsed >= 0 && elapsed < MIN_FILL_MS) {
    return NextResponse.json({ ok: true });
  }

  // --- Validation -----------------------------------------------------------
  const input: EnquiryInput = {
    name: str(body.name),
    company: str(body.company),
    email: str(body.email),
    role: str(body.role),
    message: str(body.message),
  };

  const errors = validateEnquiry(input);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Please check the form.", errors }, { status: 400 });
  }

  // --- Rate limit -----------------------------------------------------------
  const ip = clientIp(request);
  const ipHash = ip ? hashIp(ip) : null;

  try {
    if (ipHash) {
      const recent = await recentCountForIp(ipHash);
      if (recent >= HOURLY_LIMIT) {
        return NextResponse.json(
          {
            error:
              "That's a few messages in quick succession — please email us directly at info@whitepeakpartners.com.",
          },
          { status: 429 }
        );
      }
    }

    await createEnquiry(input, ipHash);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form submission failed:", err);
    return NextResponse.json(
      {
        error:
          "Something went wrong sending that. Please try again, or email us at info@whitepeakpartners.com.",
      },
      { status: 500 }
    );
  }
}
