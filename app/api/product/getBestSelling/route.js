import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function GET(req) {
    try {
        const session = await getServerSession({ req, ...authOptions });
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Fetch all orders and aggregate product quantities
        const orders = await prisma.orders.findMany({
            select: { products: true },
        });

        const productSales = {};

        orders.forEach((order) => {
            order.products.forEach(({ productId, quantity }) => {
                if (!productSales[productId]) {
                    productSales[productId] = 0;
                }
                productSales[productId] += quantity;
            });
        });

        // Sort products by quantity sold and get the top 5
        const topProductIds = Object.entries(productSales)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([productId]) => productId);

        // Fetch product details
        const products = await prisma.product.findMany({
            where: { id: { in: topProductIds } },
            select: { id: true, name: true, price: true, image: true, stock: true, description: true },
        });

        return NextResponse.json({ products }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
