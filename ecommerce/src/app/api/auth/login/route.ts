import { createAccessToken, createRefreshToken, hashToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import z from "zod";

const loginSchema = z.object({
    email: z.string().email({message: "Invalid email address"}),
    password:z.string().min(8, {message: "Password must be at least 8 characters long"})
})

export async function POST(requst: Request){
    const body = await requst.json();
     const result = loginSchema.safeParse(body);

       if (!result.success) {
    return Response.json(
      { error: "Invalid login data" },
      { status: 400 }
    );
  }

const { email, password } = result.data;

const user = await prisma.user.findUnique({
    where:{email}
})

if (!user) {
  return Response.json(
    { error: "Invalid email or password" },
    { status: 401 }
  );
}

const isPasswordValid = await bcrypt.compare(password, user.passwordHash);


 if (!isPasswordValid) {
    return Response.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  const accessToken = await createAccessToken(user.id);
  const refreshToken = await createRefreshToken(user.id);
  const refreshTokenHash = hashToken(refreshToken);

  await prisma.refreshToken.create({
  data: {
    tokenHash: refreshTokenHash,
    userId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
});



  return Response.json(
    { message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
    {
        status: 200,
        headers:{
            "Set-Cookie":[
                `accessToken=${accessToken}; HttpOnly; Path=/; Max-Age=900; SameSite=Lax`,
                `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax`,
            ].join(", ")
        }
    }
  )
}