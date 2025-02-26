"use client";
import * as React from "react";
import { useEffect } from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import "@/app/script";
import { cn } from "@/app/utils";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Post from "./post";
import Footer from "@/components/ui/footer";
import { DateTime } from "luxon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Dashboard() {
  const router = useRouter();
  const { data: session } = useSession();
  const dt = DateTime.now();
  let hourMessage;

  if (dt.hour >= 4 && dt.hour < 12) {
    hourMessage = "Good morning";
  } else if (dt.hour >= 1 && dt.hour <= 6) {
    hourMessage = "Good afternoon";
  } else {
    hourMessage = "Good evening";
  }
  // post control
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/eventCreation");
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setPosts(data.events || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
  }, []);

  const filteredEvents = posts.filter((event) => {
    const eventEndDate = new Date(event.endDate);
    return event.isPublic && eventEndDate > new Date();
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
            <div className="grid grid-cols-2 ">
              {/* Attending window */}
              <div className="w-[25rem] p-4 ">
                <div className="flex gap-5 items-center">
                  <h1 className="font-bold text-sky-800 text-3xl ml-3 mb-3">
                    Attending
                  </h1>
                  <button className="text-slate-400 text-center hover:text-slate-700">
                    Show all
                  </button>
                </div>
                <div className="flex gap-3 items-center">
                  {/* message bubble */}
                  <button className="text-2xl font-bold text-slate-300 hover:text-slate-600">
                    &lt;
                  </button>
                  <div className=" p-4 shadow rounded-xl border border-slate-300 py-5 w-[20rem]">
                    <p className="text-sky-800 text-center font-bold text-2xl ">
                      AAAAAAAAAAAAA
                    </p>
                    <p className="text-sky-800 text-center font-bold">in</p>
                    <p className="text-sky-800 text-center font-bold text-2xl">
                      30 Days!
                    </p>
                  </div>
                  <button className="text-2xl font-bold text-slate-300 hover:text-slate-600">
                    &gt;
                  </button>
                </div>
              </div>
              {/* Finished window */}
              <div className="w-[25rem] p-4 ">
                <div className="flex gap-5 items-center">
                  <h1 className="font-bold text-sky-800 text-3xl ml-3 mb-3">
                    Finished
                  </h1>
                  <button className="text-slate-400 text-center hover:text-slate-700">
                    Show all
                  </button>
                </div>
                <div className="flex gap-3 items-center">
                  {/* message bubble */}
                  <button className="text-2xl font-bold text-slate-300 hover:text-slate-600 ">
                    &lt;
                  </button>
                  <div className="p-4 shadow rounded-xl border border-slate-300 py-5 w-[20rem] items-center flex flex-col ">
                    <p className="text-sky-800 text-center font-bold text-xl">
                      You got any photos from
                    </p>
                    <p className="text-sky-800 text-center font-bold text-2xl mb-2 ">
                      AAAAAAAAAA ?
                    </p>
                    <button className="bg-slate-200 font-bold text-center text-sm px-4 p-1 rounded text-sky-800 hover:bg-slate-700 hover:text-sky-200">
                      Share!
                    </button>
                  </div>
                  <button className="text-2xl font-bold text-slate-300 hover:text-slate-600">
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
                    More info
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
