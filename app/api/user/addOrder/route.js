import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const id = session.user.id;
        const orderDetails = await req.json();

        // Validate required fields
        if (!orderDetails.products || !Array.isArray(orderDetails.products) || orderDetails.products.length === 0) {
            return NextResponse.json({ message: "Products list is required and must be a non-empty array" }, { status: 400 });
        }

        const { products, amount, name, address, phone, paymentMode = "COD" } = orderDetails;
        console.log(products);

        // Extract valid product IDs
        const productIds = products
            .map((product) => product?.productId)
            .filter((id) => id !== undefined && id !== null);

        if (productIds.length === 0) {
            return NextResponse.json({ message: "Invalid product IDs" }, { status: 400 });
        }

        // Fetch all products in the order
        const productsInStock = await prisma.product.findMany({
            where: {
                id: { in: productIds },
            },
            select: {
                id: true,
                stock: true,
            },
        });

        // Ensure products exist in the database
        if (productsInStock.length === 0) {
            return NextResponse.json({ message: "No valid products found in stock" }, { status: 400 });
        }

        // Check if any product has insufficient stock
        const outOfStockProducts = products.filter((product) => {
            const dbProduct = productsInStock.find((p) => p.id === product.productId);
            return !dbProduct || dbProduct.stock < product.quantity;
        });

        if (outOfStockProducts.length > 0) {
            return NextResponse.json({
                message: "One or more products are out of stock",
                success: false 
            }, { status: 200 });
        }

        // Create order in database
        const order = await prisma.orders.create({
            data: {
                userId: id,
                products,
                amount,
                phone,
                name,
                address,
                paymentMode,
            },
        });

        // Update product stock
        await Promise.all(
            products.map(async (product) => {
                await prisma.product.update({
                    where: { id: product.productId },
                    data: { stock: { decrement: Number(product.quantity) } },
                });
            })
        );

        // Clear the user's cart
        await prisma.user.update({
            where: { id },
            data: { cart: [] },
        });

        return NextResponse.json({ order, success: true }, { status: 201 });

    } catch (error) {
        console.error("Error placing order:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}
