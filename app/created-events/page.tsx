"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Post from "@/components/ui/post";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import CreateEvent from "@/components/ui/createEvent";
import { toast } from "sonner"; 

type EventData = {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  isPublic: boolean;
  guestLimit?: number;
  createdBy: string;
};

export default function CreatedEventsPage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<EventData[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/eventCreation");
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();

        const allEvents = data.events || [];

        const userCreated = allEvents.filter(
          (evt: EventData) => evt.createdBy === session?.user?.id
        );
        setEvents(userCreated);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    if (session?.user?.id) {
      fetchEvents();
    }
  }, [session]);

  const handleDelete = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete event");
      }

      setEvents((prev) => prev.filter((evt) => evt._id !== eventId));
      toast("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast("Failed to delete event");
    }
  };

  const handleEventUpdate = (updatedEvent: EventData) => {
    setEvents((prev) =>
      prev.map((evt) => (evt._id === updatedEvent._id ? updatedEvent : evt))
    );
    setOpenDialog(false);
    toast("Event updated successfully!");
  };

  if (!session?.user) {
    return <div>Please sign in to see your created events</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Created Events</h1>

      <div className="space-y-4">
        {events.map((evt) => (
          <div key={evt._id} className="border p-4">
            <Post post={evt} hideComment />

            {/* Edit Button */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <button
                  onClick={() => {
                    setSelectedEvent(evt);
                    setOpenDialog(true);
                  }}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
              </DialogTrigger>

              <DialogContent>
                {selectedEvent && (
                  <CreateEvent
                    eventToEdit={selectedEvent}
                    onEventUpdated={handleEventUpdate}
                    onClose={() => setOpenDialog(false)}
                  />
                )}
              </DialogContent>
            </Dialog>

            {/* Delete Button */}
            <button
              onClick={() => handleDelete(evt._id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}