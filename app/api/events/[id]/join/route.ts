import { NextResponse } from "next/server";
import { connect } from "@/app/config/dbConfig";
import { ObjectId } from "mongodb";
import Event from "@/app/models/event"; // Import the Event model

export async function POST(req: Request, { params }: { params: { id: string } }) {
    if (!params.id) {
        return NextResponse.json({ message: "⚠️ Event ID is required" }, { status: 400 });
    }

    try {
        await connect(); // Ensure database connection
        const eventId = new ObjectId(params.id);

        const event = await Event.findById(eventId);

        if (!event) {
            return NextResponse.json({ message: "⚠️ Event not found" }, { status: 404 });
        }

        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ message: "⚠️ User ID is required" }, { status: 400 });
        }

        // Ensure attendees array exists
        if (!Array.isArray(event.attendees)) {
            event.attendees = [];
        }

        // Check if user already joined
        if (event.attendees.includes(userId)) {
            return NextResponse.json({ message: "⚠️ Already joined" }, { status: 400 });
        }

        // Update event to add user to attendees list and increase attending count
        event.attendees.push(userId);
        event.attending += 1;
        await event.save();

        return NextResponse.json({ message: "✅ Joined event successfully", attending: event.attending }, { status: 200 });
    } catch (error) {
        console.error("❌ Error joining event:", error);
        return NextResponse.json({ message: "❌ Internal server error" }, { status: 500 });
    }
}