// route to update user details

import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
    }
    const id = session.user.id;
    
    const { firstName, lastName, email, address, password } = await req.json();
    
    const updatedUser = await prisma.user.update({
        where: {
        id
        },
        data: {
        firstName: firstName ? firstName : undefined,
        lastName: lastName ? lastName : undefined,
        email: email ? email : undefined,
        address: address ? address : undefined,
        password: password ? password : undefined
        },
    });
    
    return NextResponse.json(
        { message: "User details updated", success: true, updatedUser },
        { status: 200 }
    );
}