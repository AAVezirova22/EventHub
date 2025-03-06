import { NextResponse } from "next/server";
import { connect } from "@/app/config/dbConfig";
import Post from "@/app/models/event";
import User from "@/app/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
interface IParams {
  params: {
    postId: string;
  };
}

export async function PATCH(request: Request, { params }: IParams) {
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

    const { postId } = params;

    const post = await Post.findByIdAndUpdate(
      postId,
      { status: "rejected" },
      { new: true }
    );


    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Post rejected", post });
  } catch (error: any) {
    console.error("Error rejecting post:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}