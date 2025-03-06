// returns particular product details
import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

export async function GET(req, { params }) {
    try{
        const { id } = await params;
        const product = await prisma.Product.findFirst({
            where: {
                id,
            },
        });
    
        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }
        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
