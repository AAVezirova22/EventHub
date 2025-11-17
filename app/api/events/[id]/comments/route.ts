import { NextResponse } from "next/server";
import { connect } from "@/app/config/dbConfig";
import Event from "@/app/models/event"; 
import mongoose from "mongoose";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  if (!params.id) {
    return NextResponse.json({ message: "⚠️ Event ID is required" }, { status: 400 });
  }

  try {
    await connect(); 
    const event = await Event.findById(params.id);

    if (!event) {
      return NextResponse.json({ message: "⚠️ Event not found" }, { status: 404 });
    }

    const { text, userId, userName, userImage } = await req.json();

    if (!text || !userId || !userName || !userImage) {
      return NextResponse.json({ message: "⚠️ Missing comment text, user ID, name, or image" }, { status: 400 });
    }
    
    if (!Array.isArray(event.comments)) {
      event.comments = [];
    }

    const newComment = {
      _id: new mongoose.Types.ObjectId(),
      userId,
      userName,
      userImage,
      text,
      createdAt: new Date(),
    };

    event.comments.push(newComment);
    await event.save();
    
    return NextResponse.json({ message: "✅ Comment added successfully", comment: newComment }, { status: 200 });
  } catch (error) {
    console.error("❌ Error adding comment:", error);
    return NextResponse.json({ message: "❌ Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  if (!params.id) {
    return NextResponse.json({ message: "⚠️ Event ID is required" }, { status: 400 });
  }

  try {
    await connect();
    const event = await Event.findById(params.id);

    if (!event) {
      return NextResponse.json({ message: "⚠️ Event not found" }, { status: 404 });
    }

    return NextResponse.json({ comments: event.comments || [] }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching comments:", error);
    return NextResponse.json({ message: "❌ Internal server error" }, { status: 500 });
  }
}