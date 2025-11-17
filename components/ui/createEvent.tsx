import { toast } from "sonner";
import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateButtonNav() {
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
      <DialogContent>
        {/* Creating a new event by default */}
        <CreateEvent />
      </DialogContent>
    </Dialog>
  );
}

export function CreateButtonSide() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-slate-400 hover:bg-slate-600 flex items-center justify-center  rounded h-9 w-[5rem]">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="absolute w-4 h-[0.3em] bg-white rounded"></div>
            <div className="w-[0.3rem] h-4 absolute bg-white rounded"></div>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent>
        {/* Creating a new event by default */}
        <CreateEvent />
      </DialogContent>
    </Dialog>
  );
}

type EventToEdit = {
  _id: string;
  title?: string;
  description?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  guestLimit?: number;
  isPublic?: boolean;
  attending?: number;
};

interface CreateEventProps {
  eventToEdit?: EventToEdit;
  onEventUpdated?: (updatedEvent: any) => void;
  onClose?: () => void;
}

export default function CreateEvent({
  eventToEdit,
  onEventUpdated,
  onClose,
}: CreateEventProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isPeopleLimitChecked, setIsPeopleLimitChecked] = useState(false);
  const [guestLimit, setGuestLimit] = useState<number>(0);
  const [isEventPublic, setIsEventPublic] = useState(false);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [postImage, setPostImage] = useState<File | null>(null);

  const { data: session } = useSession();

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title || "");
      setDescription(eventToEdit.description || "");

      if (eventToEdit.startDate) {
        const start = new Date(eventToEdit.startDate);
        setStartDate(start.toISOString().split("T")[0]);
        setStartTime(start.toTimeString().slice(0, 5));
      }
      if (eventToEdit.endDate) {
        const end = new Date(eventToEdit.endDate);
        setEndDate(end.toISOString().split("T")[0]);
      }
      if (eventToEdit.guestLimit && eventToEdit.guestLimit > 0) {
        setIsPeopleLimitChecked(true);
        setGuestLimit(eventToEdit.guestLimit);
      }
      setIsEventPublic(eventToEdit.isPublic || false);
    }
  }, [eventToEdit]);

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
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
        setPostImage(file);
      };
      reader.onerror = () => {
        alert("Failed to read the selected image.");
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!session?.user) {
      alert("You must be logged in to create or edit an event.");
      return;
    }

    const combinedStartDate = new Date(`${startDate}T${startTime}`);

    if (!title || !description || !startDate || !endDate) {
      toast("Please fill in all required fields.");
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

    if (imageBase64) {
      formData.append("imageBase64", imageBase64);
    }

    try {
      let response;

      if (eventToEdit) {
        response = await fetch(`/api/events/${eventToEdit._id}`, {
          method: "PUT",
          body: formData,
          credentials: "include",
        });
      } else {
        formData.append("attending", "0");
        formData.append(
          "userId",
          (session?.user as { id?: string })?.id?.toString() || ""
        );
        response = await fetch("/api/eventCreation", {
          method: "POST",
          body: formData,
          credentials: "include",
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save event");
      }

      const data = await response.json();

      toast(eventToEdit ? "Event updated successfully!" : "Event created successfully!");

      if (onEventUpdated) {
        onEventUpdated(data.event);
      }

      if (onClose) {
        onClose();
      }

      setTitle("");
      setDescription("");
      setStartDate("");
      setStartTime("");
      setEndDate("");
      setIsPeopleLimitChecked(false);
      setGuestLimit(0);
      setIsEventPublic(false);
      setImageBase64(null);
    } catch (error: any) {
      console.error("Error creating/updating event:", error);
      alert(`Something went wrong: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto rounded-md ">
      <div>
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
      </div>

      <textarea
        placeholder="Description"
        className="w-full h-20 border rounded-md p-2 mt-2"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="date"
        className="w-full border rounded-md p-2 mt-2"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />

      <input
        type="date"
        className="w-full border rounded-md p-2 mt-2"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />

      <input
        type="time"
        className="w-full border rounded-md p-2 mt-2 text-gray-700"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />

      {imageBase64 && (
        <img
          src={imageBase64}
          alt="Selected"
          className="w-20 h-20 object-cover rounded mt-2"
        />
      )}


      <div className="border rounded-md p-2 cursor-pointer text-gray-500 relative mt-2">
        <span>{imageBase64 == null ? "Add image..." : "Change image..."}</span>

        <input
          type="file"
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          onChange={handleImageChange}
        />
      </div>

      <div className="flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          id="peopleLimit"
          className="w-4 h-4 border rounded-md"
          checked={isPeopleLimitChecked}
          onChange={handleGuestChange}
        />
        <label htmlFor="peopleLimit" className="text-gray-700">
          Guest limit
        </label>
        {isPeopleLimitChecked && (
          <input
            type="number"
            className="w-16 border rounded-md p-1 text-center text-slate-700"
            value={guestLimit}
            onChange={(e) => setGuestLimit(Number(e.target.value))}
          />
        )}
      </div>

      <div className="flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          id="public"
          className="w-4 h-4 border rounded-md"
          checked={isEventPublic}
          onChange={handlePrivacyChange}
        />
        <label htmlFor="public" className="text-gray-700">
          Public
        </label>
      </div>

      <div className="flex justify-end mt-4">
        <button
          type="submit"
          className="bg-black text-white rounded-md px-4 py-2"
          disabled={loading}
        >
          {loading
            ? "Submitting..."
            : eventToEdit
            ? "Update Event"
            : "Done"}
        </button>
      </div>
    </form>
  );
}