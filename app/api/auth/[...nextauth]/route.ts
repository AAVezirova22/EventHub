import User from "@/app/models/user";
import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialProvider from "next-auth/providers/credentials"
import { connect } from "@/app/config/dbConfig";
import bcryptjs from "bcryptjs"
import { NextRequest, NextResponse } from "next/server";




export const authOptions: NextAuthOptions = {
  providers: [
    CredentialProvider({
        name: "credentials",
        credentials:{},
        async authorize(credentials) {
            const {email, password} = credentials as {
                email: string;
                password: string
            }
            try{
                await connect();
                const user = await User.findOne({email});
                if(!user){
                    return null;
                }
                
                const passwordsMatch = await bcryptjs.compare(password, user.password)
                if(!passwordsMatch) {return null}
                return user;
            }catch(error){
                console.log("Error:", error);
            }
        },
    })
  ],
  session:{
    strategy:"jwt"
  },
  callbacks:{
    async jwt({token, user}){
        if(user){
            token.email = user.email;
            token.name = user.name;
            token.id = user.id;

        }
        return token;
    },
    async session({session, token}:{session:any, token:any}){
        if(session.user){
            session.user.email = token.email;
            session.user.name = token.name;
            session.user.id = token.id;
        }
        console.log(session)
        return session
    }
  },
  secret: process.env.NEXTAUTH_URL!,
  pages:{
    signIn: "/login",
  }
}

const handler = NextAuth(authOptions)
export {handler as GET, handler as POST}