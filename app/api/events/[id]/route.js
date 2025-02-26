import { connect } from "@/app/config/dbConfig";
import { ObjectId } from 'mongodb';

export async function GET(req, { params }) {
    try {
        const { id } = params;

        if (!ObjectId.isValid(id)) {
            return new Response(JSON.stringify({ message: "Invalid event ID" }), { status: 400 });
        }

        const { db } = await connect();
        const event = await db.collection("events").findOne({ _id: new ObjectId(id) });

        if (!event) {
            return new Response(JSON.stringify({ message: "Event not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(event), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error) {
        console.error("Error fetching event:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}