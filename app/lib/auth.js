import db from "../../db/src/index";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", required: true },
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

        return { id: existingUser.id.toString(), email: existingUser.email };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email, // Ensure email is used
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "secret",
  pages: {
    signIn: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
    signOut: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
    newUser: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`,
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account.provider === "google") {
        let existingUser = await db.user.findUnique({
          where: { email: profile.email },
        });
    
        if (!existingUser) {
          const [firstName, lastName] = profile.name.split(" ");
          existingUser = await db.user.create({
            data: {
              email: profile.email,
              firstName,
              lastName,
            },
          });
        }
    
        // Attach the database-generated ID to the profile
        profile.databaseId = existingUser.id;
    
        return true;
      }
      return true;
    }
    ,
    async session({ session, token }) {
      session.user.id = token.id; // Use DB ID
      return session;
    },    
    async jwt({ token, account, user, profile }) {
      // Ensure JWT stores database ID
      if (account?.provider === "google") {
        const existingUser = await db.user.findUnique({
          where: { email: token.email },
        });
    
        token.id = existingUser?.id || token.sub; // Use DB ID if found
      } else if (user) {
        token.id = user.id; // For email-password users, use DB ID
      }

      return token;
    },       
  },
};
