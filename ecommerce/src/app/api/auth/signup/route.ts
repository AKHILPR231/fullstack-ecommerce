import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import z from "zod";

const signupSchema= z.object({
 name: z.string().min(2, {message: "Name must be at least 2 characters long"}),
 email: z.string().email({message: "Invalid email address"}),
 password: z.string().min(8, {message: "Password must be at least 8 characters long"}),
});

export async function POST(request: Request) {
    const body = await request.json();
    const result = signupSchema.safeParse(body);

      if (!result.success) {
    return Response.json(
      { error: "Invalid signup data" },
      { status: 400 }
    );
  }

    const { name, email, password } = result.data;

    const existingUser = await prisma.user.findUnique({
  where: {
    email,
  },
});

if (existingUser) {
  return Response.json(
    { error: "Email already registered" },
    { status: 409 }
  );
}

const passwordHash = await bcrypt.hash(password, 12);


const newUser = await prisma.user.create({
    data:{
        name,
        email,
        passwordHash,
    }
})


return Response.json(
    {message: "User created successfully", 
     user: {id: newUser.id, 
            name: newUser.name, 
            email: newUser.email, 
            role: newUser.role}},
{ status: 201 }
)


}