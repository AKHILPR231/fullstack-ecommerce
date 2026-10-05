import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import {
  createAccessToken,
  hashToken,
} from "@/lib/auth";
import { jwtVerify } from "jose";

const refreshSecret = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET
);

export async function POST() {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return Response.json(
      { error: "Refresh token missing" },
      { status: 401 }
    );
  }

  try {
    const { payload } = await jwtVerify(
      refreshToken,
      refreshSecret
    );

    const userId = payload.userId;

    if (typeof userId !== "number") {
      return Response.json(
        { error: "Invalid refresh token" },
        { status: 401 }
      );
    }

    const refreshTokenHash = hashToken(refreshToken);

    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        tokenHash: refreshTokenHash,
        userId,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!storedToken) {
      return Response.json(
        { error: "Invalid or expired refresh token" },
        { status: 401 }
      );
    }

    const newAccessToken = await createAccessToken(userId);

    cookieStore.set("accessToken", newAccessToken, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 15,
      sameSite: "lax",
    });

    return Response.json({
      message: "Access token refreshed",
    });
  } catch {
    return Response.json(
      { error: "Invalid or expired refresh token" },
      { status: 401 }
    );
  }
}