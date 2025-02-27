import { NextResponse } from "next/server";
import { connect } from "@/app/config/dbConfig";
import { ObjectId } from "mongodb";
import Event from "@/app/models/event";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  if (!params.id) {
    return NextResponse.json({ message: "⚠️ Event ID is required" }, { status: 400 });
  }

  try {
    await connect();
    const eventId = new ObjectId(params.id);

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ message: "⚠️ Event not found" }, { status: 404 });
    }

    const { userId }: { userId: string } = await req.json();
    if (!userId) {
      return NextResponse.json({ message: "⚠️ User ID is required" }, { status: 400 });
    }

    if (!Array.isArray(event.attendees)) {
      event.attendees = [];
    }

    const alreadyJoined = event.attendees.some((uid: string | ObjectId) =>
      uid.toString() === userId
    );

    if (alreadyJoined) {
      return NextResponse.json({ message: "⚠️ Already joined" }, { status: 400 });
    }

    event.attendees.push(new ObjectId(userId));
    event.attending = (event.attending ?? 0) + 1;

    await event.save();

    return NextResponse.json(
      { message: "✅ Joined event successfully", attending: event.attending },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error joining event:", error);
    return NextResponse.json({ message: "❌ Internal server error" }, { status: 500 });
  }
}