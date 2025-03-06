"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface Event {
  _id: string;
  title: string;
  isPublic: boolean;
  endDate: string;
}

export default function EventSearch() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/eventCreation");
        if (!res.ok) throw new Error("Failed to fetch events");

        const data = await res.json();
        console.log("Fetched events:", data);

        const allEvents = Array.isArray(data.events) ? data.events : [];

        const filteredDashboardEvents = allEvents.filter((event: Event) => {
          const eventEndDate = new Date(event.endDate);
          return event.isPublic && eventEndDate > new Date();
        });

        setEvents(filteredDashboardEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (!Array.isArray(events)) return;

    if (searchQuery.trim() === "") {
      setFilteredEvents([]);
    } else {
      setFilteredEvents(
        events.filter((event: Event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, events]);
  const { t  } = useTranslation();
  return (
    <div className="relative">
      {/* Search Box */}
      <input
        type="search"
        placeholder={t("searchevent")}
        className="w-[30rem] text-[0.9rem] text-slate-600 font-semibold ml-[25rem] px-4 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Search Results Dropdown */}
      {searchQuery && (
        <div className="absolute bg-white shadow-lg mt-2 rounded-md w-[30rem] ml-[25rem] border max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-3 text-gray-500">Loading events...</div>
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((event: Event) => (
              <div
                key={event._id}
                className="p-3 hover:bg-gray-100 cursor-pointer border-b"
                onClick={() => window.location.href = `/events/${event._id}`}
              >
                {event.title}
              </div>
            ))
          ) : (
            <div className="p-3 text-gray-500">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}