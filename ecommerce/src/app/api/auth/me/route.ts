import prisma from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth";

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie");

  if (!cookieHeader) {
    return Response.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const accessToken = cookieHeader
    .split("; ")
    .find((cookie) => cookie.startsWith("accessToken="))
    ?.split("=")[1];

  if (!accessToken) {
    return Response.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    const payload = await verifyAccessToken(accessToken);

    const userId = payload.userId;

    if (typeof userId !== "number") {
      return Response.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return Response.json({ user });
  } catch {
    return Response.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}