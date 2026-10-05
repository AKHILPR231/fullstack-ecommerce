import { hashToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(){
      const cookieStore = await cookies();

      const refreshToken = cookieStore.get("refreshToken")?.value;

      if(refreshToken){
        const refreshTockenHash = hashToken(refreshToken);

        await prisma.refreshToken.deleteMany({
            where: {
                tokenHash: refreshTockenHash
            }
        })
      }

      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");

     return Response.json({
        message: "Logged out successfully",
     });
     
}