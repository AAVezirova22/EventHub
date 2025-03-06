import { connect } from "@/app/config/dbConfig";
import User from "@/app/models/user";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    console.log("Register API hit");
    await connect();
    try {
        const { name, lastName, email, username, password, image } = await req.json();
        console.log("Request body:", { name, lastName, email, username, password, image });

        const ifUserExists = await User.findOne({ email });
        if (ifUserExists) {
            console.log("User already exists");
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const salt = await bcryptjs.genSaltSync(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const savedUser = await new User({
            name,
            lastName,
            email,
            username,
            password: hashedPassword,
            image
        }).save();

        console.log("User created successfully:", savedUser);
        return NextResponse.json({
            message: "User created successfully",
            success: true,
            savedUser
        });

    } catch (error: any) {
        console.error("Error in register API:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
export async function GET(req: NextRequest) {
    await connect();
    
    try{
        
        const users = await User.find({});
        return NextResponse.json({users});
    } catch(error: any){
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

}


export async function PATCH(req: NextRequest) {
    console.log("Profile Picture Update API hit", req.body);
    await connect();

    try {
        const { email, image } = await req.json();
        console.log("Request body:", { email, image });

        if (!email || !image) {
            return NextResponse.json({ error: "Email and profile picture URL are required" }, { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found");
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        user.image = image;
        await user.save();

        console.log("Profile picture updated successfully:", user);
        return NextResponse.json({
            message: "Profile picture updated successfully",
            success: true,
            user
        });

    } catch (error: any) {
        console.error("Error in profile picture update API:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}