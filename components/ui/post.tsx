'use client'
import * as React from "react"
import  { useEffect } from 'react';
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { useState } from "react";
import "@/app/script"
import { cn } from "@/app/utils"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import {  AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Button } from "./button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DateTime } from 'luxon';
interface PostProps {
    post: any; 
  }
  
  export default function Post({ post }: PostProps) {
    const dt = DateTime.now();

    function calcTimeLeft() {
      const startDateTime = DateTime.fromISO(post.startDate);
      const diffInDays = startDateTime.diff(dt, 'days').days;
      const diffInHours = startDateTime.diff(dt, 'hours').hours;
      if (diffInDays >= 1) {
        return `${Math.floor(diffInDays)} day${Math.floor(diffInDays) > 1 ? 's' : ''}`;
      } else if (diffInDays < 1 && diffInHours >= 1){
        return `${Math.floor(diffInHours)} hour${Math.floor(diffInHours) > 1 ? 's' : ''}`;
      } else if (diffInHours < 1) {
        return ' less than 1 hour'
      }
    }
  
    const timeLeft = calcTimeLeft();
    return (
      <div>
        <div className="ml-10">
          <img src={post.image ? post.image : null} />
          <p className="text-slate-600 font-bold text-[2vw]">
            {post.title.charAt(0).toUpperCase() + post.title.slice(1)} in {timeLeft} | {post.participants} participants
          </p>
          <p className="text-slate-600 font-bold">
            <img src={post.organizerImage || ""} alt="Organizer" />
            {post.organizer}
          </p>
            {post.title.charAt(0).toUpperCase() + post.title.slice(1)} in {timeLeft} | {post.attending ? post.attending : "0"} participants
          </p>
          <div className="flex items-center">
          <img
          src={post.createdByImage || "https://cdn.pfps.gg/pfps/2301-default-2.png"} className="w-8 h-8 rounded-full mr-2"/>
          <p className="text-slate-600 font-bold">{post.createdByName}</p>
          </div>
          <p className="text-slate-500">{post.description}</p>
        </div>
      
    );
  }
  // diff outlook of a post for in a person's profile history

  export function ProfilePost({ post }: PostProps) {
    const dt = DateTime.now();

function calcTimeLeft() {
  const startDateTime = DateTime.fromISO(post.startDate);
  const diffInDays = startDateTime.diff(dt, 'days').days;
  const diffInHours = startDateTime.diff(dt, 'hours').hours;
  const diffInMins = startDateTime.diff(dt, 'minutes').minutes;

  if (diffInDays >= 1) {
    return ` in ${Math.floor(diffInDays)} day${Math.floor(diffInDays) > 1 ? 's' : ''}`;
  } else if (diffInDays < 1 && diffInHours >= 1) {
    return ` in ${Math.floor(diffInHours)} hour${Math.floor(diffInHours) > 1 ? 's' : ''}`;
  } else if (diffInHours < 1 && diffInMins > 0) {
    return ` in ${Math.floor(diffInMins)} minute${Math.floor(diffInMins) > 1 ? 's' : ''}`;
  } else {
    // Handle past events
    if (Math.abs(diffInDays) >= 1) {
      return `${Math.abs(Math.floor(diffInDays))} day${Math.abs(Math.floor(diffInDays)) > 1 ? 's' : ''} ago`;
    } else if (Math.abs(diffInHours) >= 1) {
      return `${Math.abs(Math.floor(diffInHours))} hour${Math.abs(Math.floor(diffInHours)) > 1 ? 's' : ''} ago`;
    } else {
      return `${Math.abs(Math.floor(diffInMins))} minute${Math.abs(Math.floor(diffInMins)) > 1 ? 's' : ''} ago`;
    }
  }
}

const timeLeft = calcTimeLeft();
    return (
      <div>
        <div className="ml-10">
          <img src={post.image ? post.image : null} />
          <p className="text-slate-600 font-bold text-[1vw]">
            {post.title.charAt(0).toUpperCase() + post.title.slice(1)} {timeLeft} | {post.attending ? post.attending : "0"} participants
          </p>
          <div className="flex items-center">
          <img
          src={post.createdByImage || "https://cdn.pfps.gg/pfps/2301-default-2.png"} className="w-8 h-8 rounded-full mr-2"/>
          <p className="text-slate-600 font-bold">{post.createdByName}</p>
          </div>
          <p className="text-slate-500">{post.description}</p>
        </div>
      </div>
    );
  }
