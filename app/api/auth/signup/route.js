import db from "../../../../db/src/index"; // Adjust the path based on your project structure
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    const [firstName, ...rest] = name.trim().split(" ");
    const lastName = rest.join(" ") || null; // allow empty or multiple last names

    if (!firstName || !email || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // Check if the user already exists
    const existingUser = await db.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists." }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await db.user.create({
      data: { firstName: firstName, lastName: lastName, email, password: hashedPassword },
    });

    return NextResponse.json({ message: "User created successfully!", user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}

