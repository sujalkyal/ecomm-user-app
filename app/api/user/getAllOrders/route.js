import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        
        const id = session.user.id;
        const userOrders = await prisma.orders.findMany({
            where: { userId: id },
            orderBy: { createdAt: "desc" } // Sort by most recent orders first
        });

        if (!userOrders.length) {
            return NextResponse.json({ message: "Orders not found" }, { status: 404 });
        }

        return NextResponse.json(userOrders);
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
