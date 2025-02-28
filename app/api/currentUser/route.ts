import User from "@/app/models/user";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/config/dbConfig";

export async function POST(req: NextRequest) {
    await connect();
    
    try{
       
        const { body } = await req.json();
        console.log("Request body:",
        body);
        const user = await User.findOne({
            email: body.email
        });
        console.log("User found:", user);
        return NextResponse.json({user});
    } catch(error: any){
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

}