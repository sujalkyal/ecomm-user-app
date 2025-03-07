import NextAuth from "next-auth";
import { authOptions } from "../../../lib/auth";
import { NextResponse } from "next/server";

const handler = async (req) => {
  const response = NextResponse.next();

  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Allow-Origin", "*"); // Adjust for security
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 200 });
  }

  return NextAuth(req, response, authOptions);
};

export { handler as GET, handler as POST };
