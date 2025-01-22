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

export default function Post (){

return (
    <>
        <div>
            <div className="ml-10">
                <img src="" alt="" />
                <p className="text-slate-600  font-bold text-xl ">Charity Concert in 2 days | 500 participants</p>
                <p className="text-slate-600  font-bold"><img src="" alt="" />Ani Vezirova</p>
                <p className="text-slate-500 ">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. 
                </p>
            </div>
        </div>
    </>
)

}
