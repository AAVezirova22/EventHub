import { connect } from "@/app/config/dbConfig";
import Event from "@/app/models/event";
import User from "@/app/models/user";
import { NextRequest, NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
});
const openai = new OpenAIApi(configuration);

export async function POST(req: NextRequest) {
  await connect();

  try {
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

    if (!title || !description || !startDate || !endDate || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const moderationResp = await openai.createModeration({
      input: description,
    });
    const flaggedByAI = moderationResp.data.results[0].flagged;
    const moderationStatus = flaggedByAI ? "flagged" : "approved";

    let imageUrl = "";
    const imageBase64 = formData.get("imageBase64");
    const file = formData.get("image");

    if (typeof imageBase64 === "string" && imageBase64.trim().length > 0) {
      imageUrl = imageBase64;
    } else if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const mimeType = file.type || "image/jpeg";
      imageUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;
    }

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
      status: moderationStatus,
    });

    await newEvent.save();

    return NextResponse.json({
      message: "Event created successfully",
      success: true,
      eventId: newEvent._id,
      imageUrl,
      flaggedByAI,
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
          createdByImage: user
            ? user.image
            : "https://cdn.pfps.gg/pfps/2301-default-2.png",
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
    bodyParser: false,
  },
};