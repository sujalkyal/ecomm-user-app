// returns all the products
import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

export async function GET(req) {
    try {
        const products = await prisma.product.findMany();

        if (!products) {
            return NextResponse.json({ message: "Products not found" }, { status: 404 });
        }

        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}