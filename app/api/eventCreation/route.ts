import { connect } from "@/app/config/dbConfig";
import Event from "@/app/models/event"; // Ensure the path is correct
import User from "@/app/models/user";   // Ensure the path is correct
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Ensure the upload directory exists
const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(req: NextRequest) {
  await connect();

  try {
    // Check if the request is multipart/form-data
    if (!req.headers.get("content-type")?.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    const isPublic = JSON.parse(formData.get("isPublic") as string);
    const guestLimit = parseInt(formData.get("guestLimit") as string, 10);
    const attending = parseInt(formData.get("attending") as string, 10);
    const userId = formData.get("userId") as string;

    // Validate required fields
    if (!title || !description || !startDate || !endDate || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Handle image upload
    let imageUrl = "";
    const file = formData.get("image") as File | null;
    if (file) {
      const filePath = path.join(uploadDir, `${Date.now()}-${file.name}`);
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(new Uint8Array(arrayBuffer)); // ✅ FIXED BUFFER ISSUE
      fs.writeFileSync(filePath, new Uint8Array(buffer));
      imageUrl = `/uploads/${path.basename(filePath)}`; // Store relative path0
    }

    // Save event in MongoDB
    const newEvent = new Event({
      title,
      description,
      startDate,
      endDate,
      image: imageUrl,
      isPublic,
      guestLimit,
      attending,
      createdBy: userId,
    });

    await newEvent.save();
    await User.findByIdAndUpdate(userId, { $push: { events: newEvent._id } });

    return NextResponse.json({
      message: "Event created successfully",
      success: true,
      eventId: newEvent._id,
      imageUrl,
    });
  } catch (error: any) {
    console.error("Error creating event:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await connect();

  try {
    const events = await Event.find({});

    const eventsWithUserDetails = await Promise.all(
      events.map(async (event) => {
        const user = await User.findById(event.createdBy).select("name image");
        return {
          ...event.toObject(),
          createdByName: user ? user.name : "Unknown",
          createdByImage: user ? user.image : "https://cdn.pfps.gg/pfps/2301-default-2.png",
        };
      })
    );

    return NextResponse.json({ events: eventsWithUserDetails });
  } catch (error: any) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false, // Important for handling file uploads
  },
};