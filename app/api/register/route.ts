import { connect } from "@/app/config/dbConfig";
import User from "@/app/models/user";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    console.log("Register API hit"); // Add this
    await connect();
    try {
        const { name, lastName, email, username, password } = await req.json();
        console.log("Request body:", { name, lastName, email, username, password });

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
            password: hashedPassword
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
