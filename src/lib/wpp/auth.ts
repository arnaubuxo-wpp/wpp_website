// Admin session handling: JWT (signed, httpOnly cookie) + bcrypt password
// hashing. Ported from the spec: email+password login, JWT signed cookie
// session, bcrypt-hashed passwords, middleware-protected /admin/*.
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export const SESSION_COOKIE = "wpp_admin_session";
const SESSION_TTL = "7d";

function secretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set.");
  }
  return new TextEncoder().encode(secret);
}

export interface SessionPayload extends JWTPayload {
  sub: string; // user id
  email: string;
  name: string | null;
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_TTL)
    .sign(secretKey());
}

export async function verifySession(
  token: string | undefined
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload as SessionPayload;
  } catch {
    return null;
  }
}
