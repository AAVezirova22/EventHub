"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

interface Event {
    _id: string;
    name: string;
    createdByName: string;
    date: string;
    description: string;
}

export default function EventDetails() {
    const { id } = useParams();
    const [event, setEvent] = useState<Event | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [joining, setJoining] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                console.log("Fetching all events...");
                const response = await axios.get("/api/eventCreation");

                if (!response.data.events || response.data.events.length === 0) {
                    throw new Error("No events found");
                }

                console.log("All events fetched:", response.data.events);

                // Find the event that matches the id from URL
                const currentEvent = response.data.events.find((event: Event) => event._id === id);

                if (!currentEvent) {
                    throw new Error("Event not found");
                }

                console.log("Current event found:", currentEvent);
                setEvent(currentEvent);
            } catch (error) {
                console.error("Error fetching event:", error);
                setError("Error fetching event");
            }
        };

        if (id) {
            fetchEvents();
        }
    }, [id]);

    const handleJoin = async () => {
        setJoining(true);
        try {
            const response = await axios.post(`/api/events/${id}/join`);
            if (response.status === 200) {
                window.location.href = "/profile";
            } else {
                console.error("Failed to join event");
            }
        } catch (error) {
            console.error("Error joining event:", error);
        } finally {
            setJoining(false);
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!event) {
        return <div>Loading event...</div>;
    }

    const eventDate = event.date ? new Date(event.date) : null;

    return (
        <div className="min-h-screen bg-gray-200 flex justify-center items-center p-8">
            <div className="bg-white shadow-lg rounded-xl w-full max-w-4xl p-8">
                <h1 className="font-bold text-3xl mb-4">{event.name}</h1>
                <p className="text-gray-700 mb-2">Created by: {event.createdByName || "Unknown"}</p>
                <p className="text-gray-700 mb-2">Date: {eventDate ? eventDate.toLocaleDateString() : "Invalid Date"}</p>
                <p className="text-gray-700 mb-2">Time: {eventDate ? eventDate.toLocaleTimeString() : "Invalid Time"}</p>
                <p className="text-gray-700 mb-4">{event.description}</p>
                <Button onClick={handleJoin} disabled={joining} className="bg-indigo-700 text-white px-4 py-2 rounded-3xl">
                    {joining ? "Joining..." : "Join"}
                </Button>
            </div>
        </div>
    );
}