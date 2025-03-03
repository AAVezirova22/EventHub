import User from "@/app/models/user";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/config/dbConfig";

export async function POST(req: NextRequest) {
    await connect();
    
    try {
        const body = await req.json(); 
        console.log("Request body:", body);

        const user = await User.findOne({ email: body.email });
        console.log("User found:", user);

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
