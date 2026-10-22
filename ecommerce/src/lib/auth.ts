import { jwtVerify, SignJWT } from "jose";
import crypto from "crypto";


const accessSecret = new TextEncoder().encode(
    process.env.JWT_ACCESS_SECRET
)

const refreshSecret = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET
);

export async function createAccessToken(userId: number){
    return new SignJWT({userId})
    .setProtectedHeader({alg: "HS256"})
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(accessSecret)
}

export async function createRefreshToken(userId: number) {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(refreshSecret);
}

export async function verifyAccessToken(token: string) {
  const result = await jwtVerify(token, accessSecret);
  return result.payload;
}

export function hashToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}