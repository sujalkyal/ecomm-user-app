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
        const { productId } = await req.json(); // ✅ Correctly parse JSON

        const user = await prisma.user.findUnique({
            where: { id },
            select: { wishlist: true }
        });

        if (!user || !user.wishlist) {
            return NextResponse.json({ message: "Wishlist not found" }, { status: 404 });
        }

        const updatedWishlist = await prisma.user.update({
            where: { id },
            data: {
                wishlist: user.wishlist.filter((item) => item !== productId) // ✅ Remove the item
            }
        });

        return NextResponse.json(updatedWishlist);
    } catch (error) {
        console.error("Error in removeItem:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
