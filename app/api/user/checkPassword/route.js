
import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import bcrypt from "bcrypt";

export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.forbidden();
    }
    const id = session.user.id;
    
    const { currentPassword } = await req.json();
    
    const user = await prisma.user.findUnique({
        where: {
            id
        }
    });

    if (!user) {
        return NextResponse.json({ message: "User not found", valid: false }, { status: 404 });
    }

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
        return NextResponse.json({ message: "Incorrect password", valid: false }, { status: 200 });
    }
    
    return NextResponse.json({ message: "Password Matched Successfully" , valid: true}, { status: 200 });
}