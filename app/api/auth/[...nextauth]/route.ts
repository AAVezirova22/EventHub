import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import { connect } from "@/app/config/dbConfig";
import UserModel from "@/app/models/user";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { email, password } = credentials;

        await connect();
        const dbUser = await UserModel.findOne({ email });
        if (!dbUser) throw new Error("User not found");

        const valid = await bcryptjs.compare(password, dbUser.password);
        if (!valid) throw new Error("Incorrect password");

        return {
          id: dbUser._id.toString(),
          email: dbUser.email || null,
          name: dbUser.name || null,
          image: dbUser.image ?? null,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email ?? undefined;
        token.name = user.name ?? undefined;
        token.picture = user.image ?? undefined;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id || "";
        session.user.email = token.email || null;
        session.user.name = token.name || null;
        session.user.image = token.picture || null;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };