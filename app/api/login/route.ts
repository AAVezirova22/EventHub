import { connect } from "@/app/config/dbConfig";
import User from "@/app/models/auth";
import bcryptjs from "bcryptjs"
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();
    await connect();
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
        return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
        );
    }

    // Check if the password is valid
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
        return NextResponse.json(
            { error: "Invalid credentials" },
            { status: 401 }
        );
    }

    // Successful login, return success message
    return NextResponse.json(
        { message: "Login successful", success: true },
        { status: 200 }
    );
}