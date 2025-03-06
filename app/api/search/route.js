import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

export async function GET(req) {
    try{
        const session = await getServerSession({req,...authOptions});
        if(!session){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const query = await req.json();
        const products = await prisma.product.findMany({
            where: {
                name: {
                    contains: query,
                    mode: "insensitive"
                }
            }
        });
        return NextResponse.json(products);
    }
    catch(error){
        return NextResponse.json({message:error.message},{status:500});
    }
}