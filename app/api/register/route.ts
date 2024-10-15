import { connect } from "@/app/config/dbConfig";
import User from "@/app/models/auth";
import bcryptjs from "bcryptjs"
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    
    await connect();
    console.log(1);
    try{
        const {name, lastName, email, username, password} = await req.json();

        const ifUserExists = await User.findOne({email});
        console.log(2);
        if(ifUserExists){
            console.log(3);
            return NextResponse.json(
                { error: "User already exists"},
                { status: 400}
            )
        }

        const salt = await bcryptjs.getSalt("10");
        const hashedPassword = await bcryptjs.hash(password, salt);

        const savedUser = await new User({
            name, lastName, email, username, password: hashedPassword
        }).save();

        return NextResponse.json({
            message:"User created successfully",
            success: true,
            savedUser
        })

    }catch(error:any){
        return NextResponse.json({ error: error.message }, { status: 500})
        console.log
    }
}