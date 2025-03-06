import { NextResponse } from "next/server";
import prisma from "../../../../db/src/index";

export async function GET(req, context) {
    try {
        const params = await context.params;
        const { id } = params;

        const reviews = await prisma.Review.findMany({
            where: { productId: id },
            include: {
                user: {
                    select: {
                        id: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
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
