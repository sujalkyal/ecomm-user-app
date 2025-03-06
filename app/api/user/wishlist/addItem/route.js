import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const id = session.user.id;
        const { productId } = await req.json(); // ✅ Correctly parse JSON body

        const user = await prisma.user.findUnique({
            where: { id },
            select: { wishlist: true }
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // ✅ If wishlist is an array of product IDs
        const updatedWishlist = await prisma.user.update({
            where: { id },
            data: {
                wishlist: Array.from(new Set([...user.wishlist, productId])) // Prevent duplicates
            }
        });

        return NextResponse.json(updatedWishlist);
    } catch (error) {
        console.error("Error in addItem:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
