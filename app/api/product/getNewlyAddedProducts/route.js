import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

export async function GET(req) {
  try {
    const newlyAddedProducts = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });
    return NextResponse.json(newlyAddedProducts);
  } catch (error) {
    console.error("Error fetching newly added products:", error);
    return NextResponse.json({ error: "Error fetching newly added products" }, { status: 500 });
  }
}