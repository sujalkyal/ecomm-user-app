import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function DELETE(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { productId } = await req.json();
        if (!productId) {
            return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { cart: true }
        });

        if (!user || !user.cart || user.cart.length === 0) {
            return NextResponse.json({ message: "Cart is empty" }, { status: 404 });
        }

        // Ensure proper parsing of cart JSON array
        let updatedCart = Array.isArray(user.cart) ? user.cart : JSON.parse(user.cart);

        updatedCart = updatedCart.filter(item => item.productId !== productId);

        await prisma.user.update({
            where: { id: session.user.id },
            data: { cart: updatedCart }
        });

        return NextResponse.json({ message: "Item removed from cart", cart: updatedCart });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
