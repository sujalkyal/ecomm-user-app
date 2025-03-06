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
        const { productIds } = await req.json(); // Expecting an array of productIds

        if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
            return NextResponse.json({ message: "Invalid productIds" }, { status: 400 });
        }

        // Fetch user's current cart and wishlist
        const user = await prisma.user.findUnique({
            where: { id: id },
            select: { cart: true, wishlist: true },
        });

        let cart = user?.cart || [];
        let wishlist = user?.wishlist || [];

        // Process each product
        productIds.forEach((productId) => {
            const existingProductIndex = cart.findIndex(item => item.productId === productId);
            if (existingProductIndex !== -1) {
                cart[existingProductIndex].quantity += 1;
            } else {
                cart.push({ productId, quantity: 1 });
            }

            // Remove from wishlist if present
            wishlist = wishlist.filter(item => item.productId !== productId);
        });

        // Update the user's cart and wishlist in a single database operation
        const updatedUser = await prisma.user.update({
            where: { id: id },
            data: { cart, wishlist },
            select: { cart: true },
        });

        return NextResponse.json(updatedUser.cart);
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
