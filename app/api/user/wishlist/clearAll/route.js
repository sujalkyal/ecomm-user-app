import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json({ message: "User ID not found in session" }, { status: 400 });
    }

    // Clear wishlist
    await prisma.user.update({
      where: { id: userId },
      data: { wishlist: [] },
    });

    return NextResponse.json({ message: "Wishlist cleared successfully" });
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
