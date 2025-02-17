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
          <p className="text-slate-500">{post.description}</p>
        </div>
      </div>
    );
  }
