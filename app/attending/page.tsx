"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Event {
  _id: string;
  title: string;
  startDate: string;
}

export default function AttendingEvents() {
  const { data: session } = useSession();
  const [attendingEvents, setAttendingEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAttendingEvents = async () => {
      if (!session?.user?.id) return;

      try {
        setIsLoading(true);
        const res = await fetch(`/api/attending?userId=${session.user.id}`);
        if (!res.ok) throw new Error("Failed to fetch attending events");

        const data = await res.json();
        setAttendingEvents(data.events || []); 
      } catch (error) {
        console.error("Error fetching attending events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendingEvents();
  }, [session?.user?.id]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-sky-800">Your Joined Events</h1>

      {isLoading ? (
        <p className="text-gray-500 mt-4">Loading...</p>
      ) : attendingEvents.length > 0 ? (
        <ul className="mt-4">
          {attendingEvents.map((event) => (
            <li key={event._id} className="p-4 border-b hover:bg-gray-100 cursor-pointer">
              <a href={`/events/${event._id}`} className="text-lg font-semibold text-blue-600">
                {event.title}
              </a>
              <p className="text-sm text-gray-500">Start Date: {new Date(event.startDate).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mt-4">You haven't joined any events yet.</p>
      )}
    </div>
  );
}