// add a particular product to the cart

import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function POST(req) {
    try{
        const session = await getServerSession(authOptions);
        if(!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const id = session.user.id;
        //const id = "28d82cba-fcc6-4c93-a213-4961fc58e542";
        const { productId, choice } = await req.json();

        if (!productId) {
            return NextResponse.json({ message: "Missing productId" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: id },
            select: { cart: true }, // Only fetch cart field
        });

        let cart = user?.cart || []; // Default to empty array if cart is null

        // Check if product already exists in cart
        const existingProductIndex = cart.findIndex(item => item.productId === productId);

        if (existingProductIndex !== -1) {
            // Update quantity if product exists
            if(choice) cart[existingProductIndex].quantity += 1;
            else{
                if(cart[existingProductIndex].quantity === 0) 
                    return NextResponse.json({ message: "Product quantity already 0" }, { status: 400 });
                cart[existingProductIndex].quantity -= 1;
            }
        } else {
            // Add new product
            cart.push({ productId, quantity: 1 });
            //remove from wishlist when added to cart
            const user = await prisma.user.findUnique({
                where: { id: id },
                select: { wishlist: true }
            });
        
            if (user && user.wishlist) {
                const updatedWishlist = user.wishlist.filter(item => item.productId !== productId);
        
                // Update the user's wishlist in the database
                await prisma.user.update({
                    where: { id: id },
                    data: { wishlist: updatedWishlist }
                });
            }
        }

        // Update the user's cart in the database
        const updatedUser = await prisma.user.update({
            where: { id: id },
            select: { cart: true },
            data: { cart },
        });

        return NextResponse.json(updatedUser.cart);

    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}