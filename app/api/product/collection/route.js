import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");

        if (!category) {
            return NextResponse.json({ message: "Category is required" }, { status: 400 });
        }

        const products = await prisma.product.findMany({
            where: {
                category: category,
            },
        });

        if (products.length === 0) {
            return NextResponse.json({ message: "No products found" }, { status: 200 });
        }

        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

//hahahahahahahhahaaha
