import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

export async function GET(req, { params }) {
    try {
        const { id } = params; // ✅ Correctly extract the product ID

        // ✅ Fetch all reviews for the given product ID, including user ID
        const reviews = await prisma.Review.findMany({
            where: { productId: id },
            include: {
                user: {
                    select: {
                        id: true, // ✅ Fetch user ID instead of first name
                    },
                },
            },
            orderBy: {
                createdAt: "desc", // ✅ Show latest reviews first
            },
        });

        console.log("reviews");

        if (!reviews.length) {
            return NextResponse.json({ message: "No reviews found", reviews: [] }, { status: 200 });
        }

        return NextResponse.json({ reviews }, { status: 200 });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
