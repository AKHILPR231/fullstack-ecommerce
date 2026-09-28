import prisma from "../src/lib/prisma";

async function main() {
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [
      {
        name: "Classic T-Shirt",
        description: "Comfortable cotton T-shirt for everyday wear.",
        price: 499,
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
        category: "Clothing",
        stock: 50,
      },
      {
        name: "Running Shoes",
        description: "Lightweight running shoes designed for everyday training.",
        price: 1999,
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        category: "Shoes",
        stock: 25,
      },
      {
        name: "Casual Shirt",
        description: "A comfortable casual shirt suitable for everyday use.",
        price: 899,
        image:
          "https://images.unsplash.com/photo-1596755389378-c31d21fd1273",
        category: "Clothing",
        stock: 30,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });