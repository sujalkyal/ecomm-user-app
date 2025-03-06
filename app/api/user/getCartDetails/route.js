import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        // if (!session) {
        //     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        // }
        const id = session.user.id;
        // const id = "47863ed0-d079-4750-9747-f7fc4b0dae93";

        const user = await prisma.user.findFirst({
            where: { id },
            select: { cart: true }
        });

        // if (!user) {
        //     return NextResponse.json({ message: "Cart is empty" }, { status: 404 });
        // }

        let result = [];
        const platformFee = 20;
        let totalAmount = 0;

        for (let item of user.cart) {
            const product = await prisma.product.findFirst({
                where: { id: item.productId }
            });

            if (product) {
                result.push({
                    productId: item.productId,
                    quantity: item.quantity,
                    product,
                });
                totalAmount += product.price * item.quantity;
            }
        }

        totalAmount += platformFee;

        return NextResponse.json({ result, totalAmount });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
