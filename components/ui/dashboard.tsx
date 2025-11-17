"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Post from "./post";
import Footer from "@/components/ui/footer";
import { DateTime } from "luxon";
import ThemeChanger from "./themeChanger";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

interface Event {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  attendees: string[];
  isPublic: boolean;
  status: string;
  description: string;
  photos?: string[];
}

export default function Dashboard() {
  const { t  } = useTranslation();
  const router = useRouter();
  const { data: session } = useSession();
  const dt = DateTime.now();
  let hourMessage;

  if (dt.hour >= 4 && dt.hour < 12) {
    hourMessage = t("goodmorning");
  } else if (dt.hour >= 12 && dt.hour < 18) {
    hourMessage = t("goodaf");
  } else {
    hourMessage = t("goodev");
  }

  const [posts, setPosts] = useState<Event[]>([]);
  const [attendingEvents, setAttendingEvents] = useState<Event[]>([]);
  const [finishedEvents, setFinishedEvents] = useState<Event[]>([]);
  const [attendingIndex, setAttendingIndex] = useState(0);
  const [finishedIndex, setFinishedIndex] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);


  useEffect(() => {
    const fetchPosts = async () => {
      const userId = session?.user?.id;
      if (!userId) return;

      try {
        const res = await fetch("/api/eventCreation");
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();

        const now = new Date();

        const attending =
          data.events?.filter(
            (event: Event) =>
              event.attendees.includes(userId) && new Date(event.endDate) > now
          ) || [];

        const finished =
          data.events?.filter(
            (event: Event) =>
              event.attendees.includes(userId) && new Date(event.endDate) < now
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
    return (
      event.isPublic && eventEndDate > new Date() && event.status === "approved"
    );
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const uploadPhoto = async (eventId: string | undefined) => {
    if (!eventId) {
      alert("Error: No event selected.");
      return;
    }

    if (!selectedFile) {
      toast("Please select a file first.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      console.log("Uploading photo for event:", eventId);
      console.log("Selected file:", selectedFile.name);

      const res = await fetch(`/api/events/${eventId}/photos`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(`Failed to upload photo: ${errorMessage}`);
      }

      alert("Photo uploaded successfully!");
      setSelectedFile(null);

      const refreshRes = await fetch("/api/eventCreation");

      if (!refreshRes.ok) {
        const errorMessage = await refreshRes.text();
        throw new Error(`Failed to refresh events: ${errorMessage}`);
      }

      const refreshData = await refreshRes.json();
      const userId = session?.user?.id;

      if (!userId) {
        console.error("User ID not found in session");
        return;
      }

      setFinishedEvents(
        refreshData.events?.filter(
          (event: Event) =>
            event.attendees.includes(userId) &&
            new Date(event.endDate) < new Date()
        ) || []
      );

      console.log("Finished events updated:", finishedEvents);
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert(`Failed to upload photo: ${error}`);
    } finally {
      setUploading(false);
    }
  };
  return (
    <>
      <div className="container mx-auto p-6">
      
        <h1 className="font-bold text-4xl ml-7 mb-3">
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
                  <h1 className="font-bold text-3xl ml-3 mb-3">{t("attending")}</h1>
                  <Link href="/attending">
                    <button className="text-blue-500 hover:underline">
                    {t("showall")}
                    </button>
                  </Link>
                </div>
                <div className="flex gap-3 items-center">
                  <button
                    className="text-2xl font-bold text-slate-300 hover:text-slate-600"
                    onClick={() =>
                      setAttendingIndex((prev) => Math.max(0, prev - 1))
                    }
                    disabled={attendingIndex === 0}
                  >
                    &lt;
                  </button>

                  {attendingEvents.length > 0 ? (
                    <div className="p-4 shadow rounded-xl border border-slate-300 py-5 w-[20rem]">
                      <p className="text-sky-800 text-center font-bold text-2xl">
                        {attendingEvents[attendingIndex].title}
                      </p>
                      <p className="text-sky-800 text-center font-bold">{t("in")}</p>
                      <p className="text-sky-800 text-center font-bold text-2xl">
                        {Math.ceil(
                          (new Date(
                            attendingEvents[attendingIndex].startDate
                          ).getTime() -
                            Date.now()) /
                            (1000 * 60 * 60 * 24) -
                            1
                        )}{" "}
                        {t("days")}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      {t("nojoined")}
                    </p>
                  )}

                  <button
                    className="text-2xl font-bold text-slate-300 hover:text-slate-600"
                    onClick={() =>
                      setAttendingIndex((prev) =>
                        Math.min(attendingEvents.length - 1, prev + 1)
                      )
                    }
                    disabled={attendingIndex >= attendingEvents.length - 1}
                  >
                    &gt;
                  </button>
                </div>
              </div>

              {/* Finished window */}
              <div className="w-[25rem] p-4">
                <div className="flex gap-5 items-center">
                  <h1 className="font-bold  text-3xl ml-3 mb-3">{t("finished")}</h1>
                  <Link href="/finished-events">
                    <button className="text-blue-500 hover:underline">
                    {t("showall")}
                    </button>
                  </Link>
                </div>

                <div className="flex gap-3 items-center">
                  {/* Left arrow for navigation */}
                  <button
                    className="text-2xl font-bold text-slate-300 hover:text-slate-600"
                    onClick={() =>
                      setFinishedIndex((prev) => Math.max(0, prev - 1))
                    }
                    disabled={finishedIndex === 0}
                  >
                    &lt;
                  </button>

                  {finishedEvents.length > 0 ? (
                    <div className="p-4 shadow rounded-xl border border-slate-300 py-5 w-[20rem] flex flex-col items-center">
                      <p className="text-sky-800 text-center font-bold text-xl">
                      {t("photosq")} 
                      </p>
                      <p className="text-sky-800 text-center font-bold text-2xl mb-2">
                        {finishedEvents[finishedIndex].title}?
                      </p>

                      {/* File Input for Upload */}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="pl-5 font-bold text-center text-sm px-1 py-1 rounded transition cursor-pointer inline-block"
                      />

                      {/* Upload Button */}
                      <button
                        className={`bg-slate-200 font-bold text-center text-sm px-4 p-1 rounded  
          hover:bg-slate-700 hover:text-sky-200 transition ${
            uploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
                        onClick={() =>
                          uploadPhoto(finishedEvents[finishedIndex]._id)
                        }
                        disabled={uploading}
                      >
                        {uploading ? "Uploading..." : "Share!"}
                      </button>

                      {/* Status Message */}
                      {uploading && (
                        <p className="text-gray-500 text-xs mt-2">
                          {t("upload")}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      {t("nofinished")}
                    </p>
                  )}

                  {/* Right arrow for navigation */}
                  <button
                    className="text-2xl font-bold text-slate-300 hover:text-slate-600"
                    onClick={() =>
                      setFinishedIndex((prev) =>
                        Math.min(finishedEvents.length - 1, prev + 1)
                      )
                    }
                    disabled={finishedIndex >= finishedEvents.length - 1}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>

            {/* Explore section */}
            <div className="p-4">
              <h1 className="font-bold  text-3xl ml-3 mb-3">{t("explore")}</h1>
              {filteredEvents.map((post) => (
                <div key={post._id}>
                  <Post post={post} />
                  <a
                    href={`/events/${post._id.toString()}`}
                    className="text-blue-500 hover:underline"
                  ></a>
                </div>
              ))}
            </div>
          </div>

          {/* Hot section */}
          <div className="p-4">
            <h1 className="font-bold text-3xl ml-3 mb-3">{t("hot")}</h1>
            {[...filteredEvents]
              .sort(
                (a, b) =>
                  (b.attendees?.length || 0) - (a.attendees?.length || 0)
              )
              .map((post) => (
                <Post key={post._id} post={post} />
              ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
