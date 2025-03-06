import NextAuth from "next-auth";
import { authOptions } from "../../../lib/auth";

const handler = async (req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*"); // Change "*" to a specific origin if needed
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  return NextAuth(req, res, authOptions);
};

export { handler as GET, handler as POST };
