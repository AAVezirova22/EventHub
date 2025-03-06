import { NextResponse } from "next/server";
import { connect } from "@/app/config/dbConfig";
import EventModel from "@/app/models/event";

export async function GET(req: Request) {
  try {
    await connect();
    
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "User ID is required" }, { status: 400 });

    const events = await EventModel.find({ attendees: userId });

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error("Error fetching attending events:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}   