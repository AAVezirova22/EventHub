import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";
import { getServerSession } from "next-auth";
import { connect } from "@/app/config/dbConfig";
import Post from "@/app/models/event";
import User from "@/app/models/user";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
});
const openai = new OpenAIApi(configuration);

export async function POST(request: Request) {
  try {
    await connect();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Missing title or content" }, { status: 400 });
    }

    const dbUser = await User.findOne({ email: session.user.email });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const moderationResp = await openai.createModeration({
      input: content,
    });

    const flaggedByAI = moderationResp.data.results[0].flagged;
    const moderationStatus = flaggedByAI ? "flagged" : "approved";

    const newPost = new Post({
      title,
      content,
      createdBy: dbUser._id,
      status: moderationStatus,
    });

    await newPost.save();

    return NextResponse.json({
      message: "Post created successfully!",
      post: newPost,
      flagged: flaggedByAI,
      categories: moderationResp.data.results[0].categories,
    });
  } catch (error: any) {
    console.error("Error in POST /api/posts:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}