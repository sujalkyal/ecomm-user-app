import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        if (!userId) {
            return NextResponse.json({ message: "User ID not found in session" }, { status: 400 });
        }

        // Fetch user by ID
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { wishlist: true }
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (!user.wishlist) {
            return NextResponse.json({ message: "Wishlist is empty" }, { status: 404 });
        }

        // Fetch products in the wishlist
        const products = await prisma.product.findMany({
            where: { id: { in: user.wishlist } }
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}
