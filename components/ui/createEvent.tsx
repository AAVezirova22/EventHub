'use client'

import * as React from "react"
import { useState } from "react";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function CreateEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");  // state for start time
  const [endDate, setEndDate] = useState("");
  const [isPeopleLimitChecked, setIsPeopleLimitChecked] = useState(false);
  const [guestLimit, setGuestLimit] = useState(""); 
  const [isEventPublic, setIsEventPublic] = useState(false);

  function handleGuestChange(e) {
    setIsPeopleLimitChecked(e.target.checked);
  }

  function handlePrivacyChange(e) {
    setIsEventPublic(e.target.checked);
  }

  // Handle the form submission
  async function handleSubmit(e) {
    e.preventDefault();
    const combinedStartDate = new Date(`${startDate}T${startTime}`);

    const eventData = {
      title,
      description,
      startDate: combinedStartDate.toISOString(), 
      endDate: new Date(endDate).toISOString(),
      isPublic: isEventPublic,
      guestLimit: isPeopleLimitChecked ? guestLimit : 0,
      userId: "670ee3c3d9456842cecbb399", 
    };
    try {
      const response = await fetch("/api/eventCreation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        alert("Event created successfully!");
      } else {
        alert("Failed to create event.");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Error creating event.");
    }
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <button className="bg-slate-400 hover:bg-slate-600 flex items-center justify-center mr-[3rem] rounded h-8 w-[3.6rem]">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute w-4 h-[0.3em] bg-white rounded"></div>
              <div className="w-[0.3rem] h-4 absolute bg-white rounded"></div>
            </div>
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-md p-6 rounded-xl shadow-md bg-white space-y-4">
          <DialogHeader>
            <input
              type="text"
              placeholder="Title"
              className="w-full border-b pb-2 text-lg font-semibold focus:outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <p className="text-gray-500 text-sm mt-5">This is a {isEventPublic ? "public" : "private"} event</p>
          </DialogHeader>
          <textarea
            placeholder="Description"
            className="w-full h-20 border rounded-md p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              placeholder="Start date"
              className="w-full border rounded-md p-2"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              placeholder="End date"
              className="w-full border rounded-md p-2"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border rounded-md p-2 text-gray-700 placeholder-gray-400"
            />
          </div>
          <div className="border rounded-md p-2 cursor-pointer text-gray-500 relative">
            <span>Add image...</span>
            <input type="file" className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="peopleLimit"
              className="w-4 h-4 border rounded-md"
              checked={isPeopleLimitChecked}
              onChange={handleGuestChange}
            />
            <Label htmlFor="peopleLimit" className="text-gray-700">Guest limit</Label>
            {isPeopleLimitChecked && (
              <input
                type="number"
                className="w-16 border rounded-md p-1 text-center text-slate-700"
                value={guestLimit}
                onChange={(e) => setGuestLimit(Number(e.target.value))}
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="public"
              className="w-4 h-4 border rounded-md"
              checked={isEventPublic}
              onChange={handlePrivacyChange}
            />
            <Label htmlFor="public" className="text-gray-700">Public</Label>
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="border rounded-md px-4 py-2">Cancel</Button>
            </DialogClose>
            <Button className="bg-black text-white rounded-md px-4 py-2" onClick={handleSubmit}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
