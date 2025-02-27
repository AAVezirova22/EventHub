import User from "@/app/models/user";
import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialProvider from "next-auth/providers/credentials"
import { connect } from "@/app/config/dbConfig";
import bcryptjs from "bcryptjs"
import { NextRequest, NextResponse } from "next/server";



import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string };
        try {
          await connect();
          const user = await User.findOne({ email });
          if (!user) return null;
          if (!user.password) return user; 
          
          const passwordsMatch = await bcryptjs.compare(password, user.password);
          if (!passwordsMatch) return null;
          
          return user;
        } catch (error) {
          console.log("Error:", error);
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET!,
  pages: { signIn: "/login" },
};
