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

export default function Dashboard (){

return (
    <>
        <div className="container mx-auto p-6">
            <div className="grid grid-cols-[2fr_1fr]">
                <div className="grid-span-2 space-y-6">
                    {/* Top section */}
                    <div className="grid grid-cols-2 ">
                        {/* Attending window */}
                        <div className="w-[25rem] p-4 ">
                            <div className="flex gap-5 items-center">
                                <h1 className="font-bold text-sky-800 text-3xl ml-3 mb-3">Attending</h1>
                                <button className="text-slate-400 text-center hover:text-slate-700">Show all</button>
                            </div>
                            <div className="flex gap-3 items-center">
                            {/* message bubble */}
                                <button className="text-2xl font-bold text-slate-300 hover:text-slate-600">&lt;</button>
                                <div className=" p-4 shadow rounded-xl border border-slate-300 py-5 w-[20rem]">
                                    <p className="text-sky-800 text-center font-bold text-2xl ">AAAAAAAAAAAAA</p>
                                    <p className="text-sky-800 text-center font-bold">in</p>
                                    <p className="text-sky-800 text-center font-bold text-2xl">30 Days!</p>
                                </div>
                                <button className="text-2xl font-bold text-slate-300 hover:text-slate-600">&gt;</button>
                            </div>
                        </div>
                        {/* Finished window */}
                        <div className="w-[25rem] p-4 ">
                            <div className="flex gap-5 items-center">
                                <h1 className="font-bold text-sky-800 text-3xl ml-3 mb-3">Finished</h1>
                                <button className="text-slate-400 text-center hover:text-slate-700">Show all</button>
                            </div>
                            <div className="flex gap-3 items-center">
                            {/* message bubble */}
                                <button className="text-2xl font-bold text-slate-300 hover:text-slate-600 ">&lt;</button>
                                <div className="p-4 shadow rounded-xl border border-slate-300 py-5 w-[20rem] items-center flex flex-col ">
                                    <p className="text-sky-800 text-center font-bold text-xl">You got any photos from</p>
                                    <p className="text-sky-800 text-center font-bold text-2xl mb-2 ">AAAAAAAAAA ?</p>
                                    <button className="bg-slate-200 font-bold text-center text-sm px-4 p-1 rounded text-sky-800">Share!</button>
                                </div>
                                <button className="text-2xl font-bold text-slate-300 hover:text-slate-600">&gt;</button>
                            </div>
                        </div>
                    </div>
                    {/* Explore section */}
                    <div className="p-4">
                        <h1 className="font-bold text-sky-800 text-3xl ml-3 mb-3">Explore</h1>
                        {/* post */}                    
                    </div>
                </div>
                    {/* Hot section */}
                    <div className="p-4">
                        <h1 className="font-bold text-sky-800 text-3xl ml-3 mb-3">Hot</h1>
                        
                    </div>
            </div>
        </div>
    </>
)

}