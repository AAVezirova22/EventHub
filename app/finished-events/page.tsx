"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/ui/navigation-menu";
import ProfilePost from "@/components/ui/post";

interface Event {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  attendees: string[];
  description: string;
  photos?: string[];
}

export default function FinishedEvents() {
  const { data: session } = useSession();
  const [finishedEvents, setFinishedEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState<boolean>(false);

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

  const viewPhotos = async (eventId: string) => {
    setSelectedEvent(eventId);
    setLoadingPhotos(true);
    
    try {
      const res = await fetch(`/api/events/${eventId}/photos`);
      if (!res.ok) throw new Error("Failed to fetch photos");
      const data = await res.json();
      setPhotos(data.photos || []);
    } catch (error) {
      console.error("Error loading photos:", error);
    } finally {
      setLoadingPhotos(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-200 flex flex-col items-center p-8">
        <h1 className="font-bold text-sky-800 text-3xl mb-6">Finished Events</h1>

        {finishedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {finishedEvents.map((event) => (
              <div key={event._id} className="border p-4 rounded-lg shadow-md mb-6">
                <ProfilePost post={event} />
                <button onClick={() => viewPhotos(event._id)}
                  className="bg-blue-600 text-white px-4 py-2 mt-2 rounded-lg hover:bg-blue-700">
                  View Photos
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You haven't attended any finished events.</p>
        )}

        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh] overflow-auto">
              <h2 className="text-xl font-semibold mb-4">Event Photos</h2>

              {loadingPhotos ? (
                <p className="text-gray-500">Loading photos...</p>
              ) : photos.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {photos.map((photo, index) => (
                    <img 
                      key={index} 
                      src={photo} 
                      alt={`Event Photo ${index + 1}`} 
                      className="w-full h-auto mb-2 rounded-lg object-cover" 
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">This event has no photos.</p>
              )}

              <button onClick={() => setSelectedEvent(null)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}