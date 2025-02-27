"use client";
import * as React from "react";
import { DateTime } from "luxon";
import Link from "next/link";

interface PostProps {
  post: {
    _id: string;
    title: string;
    startDate: string;
    description: string;
    image?: string;
    createdByImage?: string;
    createdByName?: string;
    attending?: number;
  };
}

export default function Post({ post }: PostProps) {
  const dt = DateTime.now();

  function calcTimeLeft() {
    const startDateTime = DateTime.fromISO(post.startDate);
    const diffInDays = startDateTime.diff(dt, "days").days;
    const diffInHours = startDateTime.diff(dt, "hours").hours;

    if (diffInDays >= 1) {
      return `${Math.floor(diffInDays)} day${Math.floor(diffInDays) > 1 ? "s" : ""}`;
    } else if (diffInDays < 1 && diffInHours >= 1) {
      return `${Math.floor(diffInHours)} hour${Math.floor(diffInHours) > 1 ? "s" : ""}`;
    } else if (diffInHours < 1) {
      return " less than 1 hour";
    }
  }

  const timeLeft = calcTimeLeft();

  return (
    <div className="border border-gray-300 shadow-md rounded-lg p-4 mb-4">
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-60 object-cover rounded-lg mb-2"
        />
      )}
      <p className="text-slate-600 font-bold text-xl">
        {post.title.charAt(0).toUpperCase() + post.title.slice(1)} in {timeLeft} | {post.attending ?? "0"} participants
      </p>
      <p className="text-slate-500 mt-2">{post.description}</p>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center">
          <img
            src={post.createdByImage || "https://cdn.pfps.gg/pfps/2301-default-2.png"}
            alt="Created By"
            className="w-10 h-10 rounded-full mr-3"
          />
          <p className="text-slate-600 font-bold">{post.createdByName}</p>
          
        </div>
        
        <Link href={`/events/${post._id.toString()}`}>
          <button className="bg-sky-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-800">
            More Info
          </button>
        </Link>
      </div>
      
    </div>
  );
}

export function ProfilePost({ post }: PostProps) {
  const dt = DateTime.now();

  function calcTimeLeft() {
    const startDateTime = DateTime.fromISO(post.startDate);
    const diffInDays = startDateTime.diff(dt, "days").days;
    const diffInHours = startDateTime.diff(dt, "hours").hours;
    const diffInMins = startDateTime.diff(dt, "minutes").minutes;

    if (diffInDays >= 1) {
      return ` in ${Math.floor(diffInDays)} day${Math.floor(diffInDays) > 1 ? "s" : ""}`;
    } else if (diffInDays < 1 && diffInHours >= 1) {
      return ` in ${Math.floor(diffInHours)} hour${Math.floor(diffInHours) > 1 ? "s" : ""}`;
    } else if (diffInHours < 1 && diffInMins > 0) {
      return ` in ${Math.floor(diffInMins)} minute${Math.floor(diffInMins) > 1 ? "s" : ""}`;
    } else {
      if (Math.abs(diffInDays) >= 1) {
        return `${Math.abs(Math.floor(diffInDays))} day${Math.abs(Math.floor(diffInDays)) > 1 ? "s" : ""} ago`;
      } else if (Math.abs(diffInHours) >= 1) {
        return `${Math.abs(Math.floor(diffInHours))} hour${Math.abs(Math.floor(diffInHours)) > 1 ? "s" : ""} ago`;
      } else {
        return `${Math.abs(Math.floor(diffInMins))} minute${Math.abs(Math.floor(diffInMins)) > 1 ? "s" : ""} ago`;
      }
    }
  }

  const timeLeft = calcTimeLeft();

  return (
    <div className="border border-gray-300 shadow-md rounded-lg p-4 mb-4">
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-48 object-cover rounded-lg mb-2"
        />
      )}
      <p className="text-slate-600 font-bold text-lg">
        {post.title.charAt(0).toUpperCase() + post.title.slice(1)} {timeLeft} | {post.attending ?? "0"} participants
      </p>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center">
          <img
            src={post.createdByImage || "https://cdn.pfps.gg/pfps/2301-default-2.png"}
            className="w-10 h-10 rounded-full mr-3"
          />
          <p className="text-slate-600 font-bold">{post.createdByName}</p>
        </div>

        <Link href={`/events/${post._id.toString()}`}>
          <button className="bg-sky-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-800">
            More Info
          </button>
        </Link>
      </div>
      <p className="text-slate-500 mt-2">{post.description}</p>
    </div>
  );
}