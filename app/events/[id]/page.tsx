"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { CalendarDays } from "lucide-react";
import Navbar from "@/components/ui/navigation-menu";


interface Event {
  _id: string;
  title: string;
  createdByName?: string;
  startDate: string;
  description: string;
  attending: number;
  attendees?: string[];
}

interface CustomSessionUser {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
}

interface Notification {
  message: string;
  icon: string;
}

export default function EventDetails() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [event, setEvent] = useState<Event | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const savedNotifications = localStorage.getItem("notifications");
    return savedNotifications ? JSON.parse(savedNotifications) : [];
  });

  const storeNotificationsToLocalStorage = (notifications: Notification[]) => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  };

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        console.log("Fetching all events from /api/eventCreation...");
        const response = await axios.get("/api/eventCreation");

        if (!response.data.events || response.data.events.length === 0) {
          throw new Error("No events found");
        }

        const currentEvent = response.data.events.find((evt: Event) => evt._id === id);

        if (!currentEvent) {
          throw new Error("Event not found");
        }

        setEvent(currentEvent);

        const userId = (session?.user as CustomSessionUser)?.id;
        if (userId && currentEvent.attendees?.includes(userId)) {
          setHasJoined(true);
        }
      } catch (err: any) {
        console.error("Error fetching event:", err);
        setError("Error fetching event");
      }
    };

    if (id) {
      fetchEventData();
    }
  }, [id, session]);

  const handleJoin = async () => {
    if (!session?.user) {
      alert("You must be logged in to join");
      return;
    }
    const userId = (session.user as CustomSessionUser)?.id;
    if (!userId) {
      alert("User ID not found");
      return;
    }

    setJoining(true);
    try {
      const response = await axios.post(`/api/events/${id}/join`, { userId });

      if (response.status === 200) {
        setHasJoined(true);

        setEvent((prev) =>
          prev
            ? {
              ...prev,
              attending: (prev.attending || 0) + 1,
              attendees: prev.attendees ? [...prev.attendees, userId] : [userId],
            }
            : prev
        );
        const message = ("Joined " + event?.title + " by " + event?.createdByName + "!");
        toast(message);
        setNotifications((prevNotifications: any) => {
          const updatedNotifications = [...prevNotifications, { message, icon: "CalendarDays" }];
          storeNotificationsToLocalStorage(updatedNotifications);
          return updatedNotifications;
        });
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

  const eventDate = event.startDate ? new Date(event.startDate) : null;
  return (
    <>
   <Navbar />
   
    <div className="min-h-screen bg-gray-200 flex justify-center items-center p-8">
      
      <div className="bg-white shadow-lg rounded-xl w-full max-w-4xl p-8">
        <h1 className="font-bold text-3xl mb-4">{event.title}</h1>
        <p className="text-gray-700 mb-2">
          Created by: {event.createdByName || "Unknown"}
        </p>
        <p className="text-gray-700 mb-2">
          Date: {eventDate ? eventDate.toLocaleDateString("en-GB") : "N/A"}
        </p>
        <p className="text-gray-700 mb-2">
          Time:{" "}
          {eventDate
            ? eventDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "N/A"}
        </p>
        <p className="text-gray-700 mb-4">Description: {event.description}</p>
        <p className="text-gray-700 font-semibold mb-4">
          Attending: {event.attending}
        </p>

        <Button
          onClick={handleJoin}
          disabled={hasJoined || joining}
          className={`px-4 py-2 rounded-3xl ${hasJoined
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-indigo-700 text-white"
            }`}
        >
          {hasJoined ? "Joined" : joining ? "Joining..." : "Join"}

        </Button>
      </div>
    </div>
     </>
  );
}