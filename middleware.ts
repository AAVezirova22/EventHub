import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";


export async function middleware(req:NextRequest) {
    const path = req.nextUrl.pathname;
    const token = await getToken({
        req: req,
        secret: process.env.NEXTAUTH_SECRET
    })

 
}

