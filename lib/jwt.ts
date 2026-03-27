import { SignJWT, jwtVerify } from "jose";

export type JwtPayload = {
  id: string;
  handle: string;
};

const COOKIE_NAME = "auth_token";
const EXPIRY = "1y";

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is not set.");
  return new TextEncoder().encode(secret);
}

export async function signToken(payload: JwtPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (
      typeof payload.id === "string" &&
      typeof payload.handle === "string"
    ) {
      return { id: payload.id, handle: payload.handle };
    }
    return null;
  } catch {
    return null;
  }
}

export { COOKIE_NAME };
