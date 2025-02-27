"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/ui/navigation-menu";
import { ProfilePost } from "@/components/ui/post";

interface Event {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  attendees: string[];
  description: string;
}

export default function FinishedEvents() {
  const { data: session } = useSession();
  const [finishedEvents, setFinishedEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchFinishedEvents = async () => {
      if (!session?.user?.id) return;

      try {
        const res = await fetch("/api/eventCreation");
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();

        const now = new Date();
        const userFinishedEvents = data.events?.filter((event: Event) => {
          const eventEndDate = new Date(event.endDate);
          return event.attendees.includes(session.user!.id) && eventEndDate < now;
        }) || [];

        setFinishedEvents(userFinishedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchFinishedEvents();
  }, [session?.user?.id]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-200 flex flex-col items-center p-8">
        <h1 className="font-bold text-sky-800 text-3xl mb-6">Finished Events</h1>

        {finishedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {finishedEvents.map((event) => (
              <ProfilePost key={event._id} post={event} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You haven't attended any finished events.</p>
        )}
      </div>
    </>
  );
}