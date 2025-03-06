import { NextResponse } from "next/server";
import { connect } from "@/app/config/dbConfig";
import Post from "@/app/models/event";
import User from "@/app/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    await connect();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const dbUser = await User.findOne({ email: session.user.email });
    if (!dbUser || dbUser.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const posts = await Post.find({
      status: { $in: ["flagged", "pending"] }
    }).populate("createdBy", "name email");

    return NextResponse.json({ posts });
  } catch (error: any) {
    console.error("Error fetching flagged posts:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}