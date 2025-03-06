import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import { connect } from "@/app/config/dbConfig";
import UserModel from "@/app/models/user";
import User from "@/app/models/user";

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
        const dbUser = await User.findOne({ email });
        if (!dbUser) throw new Error("User not found");

        const valid = await bcryptjs.compare(password, dbUser.password);
        if (!valid) throw new Error("Incorrect password");

        return {
          id: dbUser._id.toString(),
          email: dbUser.email || null,
          name: dbUser.name || null,
          image: dbUser.image ?? null,
          lastName: dbUser.lastName ?? null,
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
        const dbUser = await User.findOne({ email: user.email });
        token.id = user.id;
        token.email = user.email ?? undefined;
        token.name = user.name ?? undefined;
        token.picture = user.image ?? undefined;
        token.lastName = dbUser.lastName ?? undefined;
      }
      return token;
    },
    async session({ session, token }) {
      const userSession: any = session;
      if (userSession.user) {
        const dbUser = await User.findOne({ email: userSession?.user?.email });
        userSession.user.id = token.id || "";
        userSession.user.email = token.email || null;
        userSession.user.name = token.name || null;
        userSession.user.image = token.picture || null;
      }
     
      userSession.accessToken = token;
      // console.log("userSession!!!!!!!!!!!!!!!!!!!!:", userSession);
      return userSession;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };