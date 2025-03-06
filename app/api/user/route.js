// returns user profile details

import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

export async function GET(req) {
    
    try{
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" },{ status: 401 });
        }

        const id = session.user.id;
        const user = await prisma.user.findFirst({
            where: {
                id,
            },
        });
    
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}