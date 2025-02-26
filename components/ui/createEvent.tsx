"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSession, signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isPeopleLimitChecked, setIsPeopleLimitChecked] = useState(false);
  const [guestLimit, setGuestLimit] = useState<number>(0);
  const [isEventPublic, setIsEventPublic] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const { data: session, status } = useSession();

  function handleGuestChange(e: React.ChangeEvent<HTMLInputElement>) {
    setIsPeopleLimitChecked(e.target.checked);
  }

  function handlePrivacyChange(e: React.ChangeEvent<HTMLInputElement>) {
    setIsEventPublic(e.target.checked);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        alert("Only JPG, PNG, and WebP images are allowed.");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert("Image must be smaller than 2MB.");
        return;
      }

      setImage(file);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!session?.user) {
      alert("You must be logged in to create an event.");
      return;
    }

    const combinedStartDate = new Date(`${startDate}T${startTime}`);

    if (!title || !description || !startDate || !endDate) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("startDate", combinedStartDate.toISOString());
    formData.append("endDate", new Date(endDate).toISOString());
    formData.append("isPublic", JSON.stringify(isEventPublic));
    formData.append(
      "guestLimit",
      isPeopleLimitChecked ? guestLimit.toString() : "0"
    );
    formData.append("attending", "0");

    formData.append(
      "userId",
      (session?.user as { id?: string })?.id?.toString() || ""
    );

    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch("/api/eventCreation", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        alert("Event created successfully!");
        console.log("Event Created:", data);

        setTitle("");
        setDescription("");
        setStartDate("");
        setStartTime("");
        setEndDate("");
        setIsPeopleLimitChecked(false);
        setGuestLimit(0);
        setIsEventPublic(false);
        setImage(null);
      } else {
        const errorData = await response.json();
        alert(`Failed to create event: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
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
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <input
              type="text"
              placeholder="Title"
              className="w-full border-b pb-2 text-lg font-semibold focus:outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <p className="text-gray-500 text-sm mt-5">
              This is a {isEventPublic ? "public" : "private"} event
            </p>
          </DialogHeader>

          <textarea
            placeholder="Description"
            className="w-full h-20 border rounded-md p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="date"
            className="w-full border rounded-md p-2"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <input
            type="date"
            className="w-full border rounded-md p-2"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <input
            type="time"
            className="w-full border rounded-md p-2 text-gray-700"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />

          <div className="border rounded-md p-2 cursor-pointer text-gray-500 relative">
            <span>Add image...</span>
            <input
              type="file"
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              onChange={handleImageChange}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="peopleLimit"
              className="w-4 h-4 border rounded-md"
              checked={isPeopleLimitChecked}
              onChange={handleGuestChange}
            />
            <Label htmlFor="peopleLimit" className="text-gray-700">
              Guest limit
            </Label>
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
            <Label htmlFor="public" className="text-gray-700">
              Public
            </Label>
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-black text-white rounded-md px-4 py-2"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Done"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}