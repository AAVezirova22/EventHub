"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

interface Event {
    name: string;
    createdByName: string;
    date: string;
    description: string;
}

export default function EventDetails() {
    const { id } = useParams();
    const [event, setEvent] = useState<Event | null>(null);
    //const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [joining, setJoining] = useState(false);


// useEffect(() => {
//       try {
//         const res = await fetch("/api/eventCreation");
//         if (!res.ok) throw new Error("Failed to fetch events");
//         const data = await res.json();
//         setPosts(data.events || []); 
//       } catch (error) {
//         console.error(error);
//       }
//     };
  
//     fetchPosts();
//   }, []);

useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await fetch("/api/eventCreation");
                if (!response.ok) throw new Error("Failed to fetch events");
                const data = await response.json();
                setEvent(data.events || []); 
                const currentEvent = data.events.find((event: any) => event._id === id);
                //setEvent(currentEvent || [] );
            } catch (error) {
                console.error('Error fetching event:', error);
                setError('Error fetching event');
                //setLoading(false);
            }
        };

        fetchEvent();
}, [id]);


    const handleJoin = async () => {
        setJoining(true);
        try {
            const response = await axios.post(`/api/events/${id}/join`);
            if (response.status === 200) {
                window.location.href = "/profile"; // Redirect to profile page
            } else {
                console.error("Failed to join event");
            }
        } catch (error) {
            console.error("Error joining event:", error);
        } finally {
            setJoining(false);
        }
    };

    // if (loading) {
    //     return <div>Loading...</div>;
    // }

    if (error) {
        return <div>{error}</div>;
    }

    if (!event) {
        return <div>No event found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-200 flex justify-center items-center p-8">
            <div className="bg-white shadow-lg rounded-xl w-full max-w-4xl p-8">
                <h1 className="font-bold text-3xl mb-4">{event.name}</h1>
                <p className="text-gray-700 mb-2">Created by: {event.createdByName}</p>
                <p className="text-gray-700 mb-2">Date: {new Date(event.date).toLocaleDateString()}</p>
                <p className="text-gray-700 mb-2">Time: {new Date(event.date).toLocaleTimeString()}</p>
                <p className="text-gray-700 mb-4">{event.description}</p>
                <Button onClick={handleJoin} disabled={joining} className="bg-indigo-700 text-white px-4 py-2 rounded-3xl">
                    {joining ? "Joining..." : "Join"}
                </Button>
            </div>
        </div>
    );
}