import { z } from "zod";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth";

const addToCartSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive().default(1),
});

export async function POST(request: Request) {
  // 1. Get access token from cookie
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return Response.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  // 2. Verify the logged-in user
  try {
    const payload = await verifyAccessToken(accessToken);

    if (typeof payload.userId !== "number") {
      return Response.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const userId = payload.userId;

    // 3. Validate request body
    const body = await request.json();

    const result = addToCartSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        { error: "Invalid cart data" },
        { status: 400 }
      );
    }

    const { productId, quantity } = result.data;

    // 4. Check whether the product exists
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return Response.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // 5. Check stock
    if (product.stock < quantity) {
      return Response.json(
        { error: "Not enough stock" },
        { status: 400 }
      );
    }

    // 6. Find or create the user's cart
    const cart = await prisma.cart.upsert({
      where: {
        userId,
      },
      update: {},
      create: {
        userId,
      },
    });

    // 7. Check whether product is already in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > product.stock) {
        return Response.json(
          { error: "Not enough stock" },
          { status: 400 }
        );
      }

      const updatedItem = await prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: newQuantity,
        },
      });

      return Response.json({
        message: "Cart updated",
        item: updatedItem,
      });
    }

    // 8. Product isn't in cart → create it
    const cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });

    return Response.json(
      {
        message: "Product added to cart",
        item: cartItem,
      },
      { status: 201 }
    );
  } catch {
    return Response.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}


export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return Response.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    const payload = await verifyAccessToken(accessToken);

    if (typeof payload.userId !== "number") {
      return Response.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const userId = payload.userId;

    const cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      return Response.json({
        cart: null,
        items: [],
      });
    }

    return Response.json({
      cart,
    });
  } catch {
    return Response.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}


export async function PATCH(request: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return Response.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    const payload = await verifyAccessToken(accessToken);

    if (typeof payload.userId !== "number") {
      return Response.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const userId = payload.userId;

    const body = await request.json();

    const result = z
      .object({
        itemId: z.number().int().positive(),
        quantity: z.number().int().positive(),
      })
      .safeParse(body);

    if (!result.success) {
      return Response.json(
        { error: "Invalid cart data" },
        { status: 400 }
      );
    }

    const { itemId, quantity } = result.data;

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          userId,
        },
      },
      include: {
        product: true,
      },
    });

    if (!cartItem) {
      return Response.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    if (quantity > cartItem.product.stock) {
      return Response.json(
        { error: "Not enough stock" },
        { status: 400 }
      );
    }

    const updatedItem = await prisma.cartItem.update({
      where: {
        id: itemId,
      },
      data: {
        quantity,
      },
    });

    return Response.json({
      message: "Cart updated",
      item: updatedItem,
    });
  } catch {
    return Response.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}



export async function DELETE(request: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return Response.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    const payload = await verifyAccessToken(accessToken);

    if (typeof payload.userId !== "number") {
      return Response.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const userId = payload.userId;
    const body = await request.json();

    const result = z
      .object({
        itemId: z.number().int().positive(),
      })
      .safeParse(body);

    if (!result.success) {
      return Response.json(
        { error: "Invalid cart item ID" },
        { status: 400 }
      );
    }

    const { itemId } = result.data;

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          userId,
        },
      },
    });

    if (!cartItem) {
      return Response.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    await prisma.cartItem.delete({
      where: { id: cartItem.id },
    });

    return Response.json({
      message: "Item removed from cart",
    });
  } catch {
    return Response.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}