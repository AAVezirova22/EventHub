import { NextResponse } from "next/server";
import { connect } from "@/app/config/dbConfig";
import Event from "@/app/models/event";

export async function GET(request: Request, { params }: any) {
  try {
    await connect();
    const { id } = params;
    const event = await Event.findById(id).populate("attendees"); 

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ event }, { status: 200 });
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: any) {
  try {
    await connect();
    const { id } = params;

    const formData = await request.formData();

    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString();
    const startDate = formData.get("startDate")?.toString();
    const endDate = formData.get("endDate")?.toString();
    const isPublic = JSON.parse(formData.get("isPublic")?.toString() || "false");
    const guestLimit = parseInt(formData.get("guestLimit")?.toString() || "0");


    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { 
        title, 
        description, 
        startDate, 
        endDate, 
        isPublic, 
        guestLimit 
      },
      { new: true } 
    );

    if (!updatedEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Event updated", event: updatedEvent }, { status: 200 });
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: any) {
  try {
    await connect();
    const { id } = params;

    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Event deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}