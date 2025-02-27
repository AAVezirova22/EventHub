import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {

  interface User extends DefaultUser {
    id: string;                   
    email?: string | null;
    image?: string | null;
    name?: string | null;
  }

  interface Session {
    user: {
      id: string;
      email?: string | null;
      image?: string | null;
      name?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    picture?: string | null;
  }
}