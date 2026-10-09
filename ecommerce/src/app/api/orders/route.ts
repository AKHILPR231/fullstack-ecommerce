
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth";

class OrderError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "OrderError";
  }
}

export async function POST() {
  // 1. Read the access token
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return Response.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  // 2. Verify the user
  let userId: number;

  try {
    const payload = await verifyAccessToken(accessToken);

    if (typeof payload.userId !== "number") {
      return Response.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    userId = payload.userId;
  } catch {
    return Response.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }

  try {
    // 3. Create the order in a database transaction
    const order = await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new OrderError("Your cart is empty", 400);
      }

      // 4. Validate stock and calculate the total
      for (const item of cart.items) {
        if (item.product.stock < item.quantity) {
          throw new OrderError(
            `${item.product.name} does not have enough stock`,
            409
          );
        }
      }

      const totalAmount = cart.items.reduce(
        (total, item) =>
          total + item.product.price * item.quantity,
        0
      );

      // 5. Save the order and product-price snapshots
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          status: "PENDING",
          paymentStatus: "PENDING",
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              productName: item.product.name,
              price: item.product.price,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // 6. Decrease stock safely
      // The stock condition also protects against concurrent orders.
      for (const item of cart.items) {
        const result = await tx.product.updateMany({
          where: {
            id: item.productId,
            stock: { gte: item.quantity },
          },
          data: {
            stock: { decrement: item.quantity },
          },
        });

        if (result.count !== 1) {
          throw new OrderError(
            `${item.product.name} stock changed. Please try again.`,
            409
          );
        }
      }

      // 7. Clear the cart after creating the order
      await tx.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      });

      return newOrder;
    });

    return Response.json(
      {
        message: "Order created successfully",
        order,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof OrderError) {
      return Response.json(
        { error: error.message },
        { status: error.status }
      );
    }

    console.error("Order creation failed:", error);

    return Response.json(
      { error: "Unable to create your order" },
      { status: 500 }
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

  let userId: number;

  try {
    const payload = await verifyAccessToken(accessToken);

    if (typeof payload.userId !== "number") {
      return Response.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    userId = payload.userId;
  } catch {
    return Response.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }

  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json({ orders });
  } catch (error) {
    console.error("Fetching orders failed:", error);

    return Response.json(
      { error: "Unable to fetch orders" },
      { status: 500 }
    );
  }
}