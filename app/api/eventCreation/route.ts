import { connect } from "@/app/config/dbConfig";
import Event from "@/app/models/event"; // Make sure this is the correct path
import User from "@/app/models/user";   // Make sure this is the correct path
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connect();

  try {
    const { title, description, startDate, endDate, image, isPublic, guestLimit, userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Create the event
    const newEvent = new Event({
      title,
      description,
      startDate,
      endDate,
      image,
      isPublic,
      guestLimit,
      createdBy: userId,
    });
    await newEvent.save();

    await User.findByIdAndUpdate(userId, { $push: { events: newEvent._id } });

    return NextResponse.json({
      message: "Event created successfully",
      success: true,
      eventId: newEvent._id,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await connect(); // Ensure the database is connected
  
  try {
    const events = await Event.find({});

    return NextResponse.json({ events });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

