import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "example@gmail.com", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) {
          throw new Error("Email and Password are required.");
        }

        const existingUser = await db.user.findFirst({
          where: { email: credentials.email },
        });

        if (!existingUser) {
          throw new Error("No user found with this email.");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, existingUser.password);
        if (!isPasswordValid) {
          throw new Error("Invalid credentials.");
        }

        return {
          id: existingUser.id.toString(),
          email: existingUser.email,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.JWT_SECRET || "secret",
  pages: {
    signIn: "http://localhost:3000/auth/login",  // Custom login page
    signOut: "http://localhost:3000/auth/login",
    newUser: "http://localhost:3000/auth/signup", // Redirect here after user signs up (optional)
  },
  callbacks: {
    async session({ token, session }) {
      session.user.id = token.sub;
      return session;
    },
  },
};
