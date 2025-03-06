// post endpoint for checkout

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
        //const id = "28d82cba-fcc6-4c93-a213-4961fc58e542";

        const { name, address, phone, paymentMode } = await req.json();

        const user = await prisma.user.findUnique({
            where: { id },
            select: { cart: true }
        });

        if (!user || !user.cart || !Array.isArray(user.cart)) {
            return NextResponse.json({ message: "Cart details not found" }, { status: 404 });
        }

        // Fetch all products in a single query
        const productIds = user.cart.map(item => item.productId);
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } }
        });

        if (products.length !== user.cart.length) {
            return NextResponse.json({ message: "Some products not found" }, { status: 404 });
        }

        const outOfStockItems = [];
        let amount = 0;

        // Validate stock and calculate total amount
        user.cart.forEach(cartItem => {
            const product = products.find(p => p.id === cartItem.productId);
            if (!product || product.stock < cartItem.quantity) {
                outOfStockItems.push(product);
            } else {
                amount += product.price * cartItem.quantity;
            }
        });

        if (outOfStockItems.length > 0) {
            return NextResponse.json({ success: false, outOfStockItems });
        }

        // Create order
        const order = await prisma.orders.create({
            data: {
                userId: id,
                name,
                address,
                phone,
                paymentMode,
                products: user.cart,
                amount
            }
        });

        // Clear the cart by setting it to an empty array
        await prisma.user.update({
            where: { id },
            data: { cart: [] }
        });

        return NextResponse.json(order);
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
