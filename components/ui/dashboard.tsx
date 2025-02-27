"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Post from "./post";
import Footer from "@/components/ui/footer";
import { DateTime } from "luxon";

interface Event {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  attendees: string[];
  isPublic: boolean;
  status: string;
  description: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { data: session } = useSession();
  const dt = DateTime.now();
  let hourMessage;

  if (dt.hour >= 4 && dt.hour < 12) {
    hourMessage = "Good morning";
  } else if (dt.hour >= 12 && dt.hour < 18) {
    hourMessage = "Good afternoon";
  } else {
    hourMessage = "Good evening";
  }

  const [posts, setPosts] = useState<Event[]>([]);
  const [attendingEvents, setAttendingEvents] = useState<Event[]>([]);
  const [finishedEvents, setFinishedEvents] = useState<Event[]>([]);
  const [attendingIndex, setAttendingIndex] = useState(0);
  const [finishedIndex, setFinishedIndex] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!session?.user?.id) return;

      try {
        const res = await fetch("/api/eventCreation");
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();

        const now = new Date();
        const userId = session.user.id;

        const attending = data.events?.filter(
          (event: Event) => event.attendees.includes(userId) && new Date(event.endDate) > now
        ) || [];

        const finished = data.events?.filter(
          (event: Event) => event.attendees.includes(userId) && new Date(event.endDate) < now
        ) || [];

        setPosts(data.events || []);
        setAttendingEvents(attending);
        setFinishedEvents(finished);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
  }, [session?.user?.id]);

  const filteredEvents = posts.filter((event) => {
    const eventEndDate = new Date(event.endDate);
    return event.isPublic && eventEndDate > new Date() && event.status === "approved";
  });

  return (
    <>
      <div className="container mx-auto p-6">
        <h1 className="font-bold text-sky-800 text-4xl ml-7 mb-3">
          {hourMessage},{" "}
          <a href="/[userId]" className="text-5xl">
            {session?.user?.name}
          </a>
          !
        </h1>
        <div className="grid grid-cols-[2fr_1fr]">
          <div className="grid-span-2 space-y-6">
            {/* Top section */}
            <div className="grid grid-cols-2">
              {/* Attending window */}
              <div className="w-[25rem] p-4">
                <div className="flex gap-5 items-center">
                  <h1 className="font-bold text-sky-800 text-3xl ml-3 mb-3">Attending</h1>
                  <Link href="/attending">
                    <button className="text-blue-500 hover:underline">Show All</button>
                  </Link>
                </div>
                <div className="flex gap-3 items-center">
                  <button
                    className="text-2xl font-bold text-slate-300 hover:text-slate-600"
                    onClick={() => setAttendingIndex((prev) => Math.max(0, prev - 1))}
                    disabled={attendingIndex === 0}
                  >
                    &lt;
                  </button>

                  {attendingEvents.length > 0 ? (
                    <div className="p-4 shadow rounded-xl border border-slate-300 py-5 w-[20rem]">
                      <p className="text-sky-800 text-center font-bold text-2xl">
                        {attendingEvents[attendingIndex].title}
                      </p>
                      <p className="text-sky-800 text-center font-bold">in</p>
                      <p className="text-sky-800 text-center font-bold text-2xl">
                        {Math.ceil((new Date(attendingEvents[attendingIndex].startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} Days!
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500">No upcoming events</p>
                  )}

                  <button
                    className="text-2xl font-bold text-slate-300 hover:text-slate-600"
                    onClick={() => setAttendingIndex((prev) => Math.min(attendingEvents.length - 1, prev + 1))}
                    disabled={attendingIndex >= attendingEvents.length - 1}
                  >
                    &gt;
                  </button>
                </div>
              </div>

              {/* Finished window */}
              <div className="w-[25rem] p-4">
                <div className="flex gap-5 items-center">
                  <h1 className="font-bold text-sky-800 text-3xl ml-3 mb-3">Finished</h1>
                  <Link href="/finished-events">
                    <button className="text-blue-500 hover:underline">Show All</button>
                  </Link>
                </div>
                <div className="flex gap-3 items-center">
                  <button
                    className="text-2xl font-bold text-slate-300 hover:text-slate-600"
                    onClick={() => setFinishedIndex((prev) => Math.max(0, prev - 1))}
                    disabled={finishedIndex === 0}
                  >
                    &lt;
                  </button>

                  {finishedEvents.length > 0 ? (
                    <div className="p-4 shadow rounded-xl border border-slate-300 py-5 w-[20rem] items-center flex flex-col">
                      <p className="text-sky-800 text-center font-bold text-xl">You got any photos from</p>
                      <p className="text-sky-800 text-center font-bold text-2xl mb-2">
                        {finishedEvents[finishedIndex].title}?
                      </p>
                      <button className="bg-slate-200 font-bold text-center text-sm px-4 p-1 rounded text-sky-800 hover:bg-slate-700 hover:text-sky-200">
                        Share!
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-500">No finished events</p>
                  )}

                  <button
                    className="text-2xl font-bold text-slate-300 hover:text-slate-600"
                    onClick={() => setFinishedIndex((prev) => Math.min(finishedEvents.length - 1, prev + 1))}
                    disabled={finishedIndex >= finishedEvents.length - 1}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>

            {/* Explore section */}
            <div className="p-4">
              <h1 className="font-bold text-sky-800 text-3xl ml-3 mb-3">
                Explore
              </h1>
              {filteredEvents.map((post) => (
                <div key={post._id}>
                  <Post post={post} />
                  <a
                    href={`/events/${post._id.toString()}`}
                    className="text-blue-500 hover:underline"
                  >
                  
                  </a>
                </div>
              ))}
            </div>
          </div>
          
          {/* Hot section */}
          <div className="p-4">
            <h1 className="font-bold text-sky-800 text-3xl ml-3 mb-3">Hot</h1>
            {filteredEvents.map((post) => (
              <Post key={post._id} post={post} />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}