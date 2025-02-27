"use client";

import { useState } from "react";
import NotificationDialog from "./notificationsDialog";

export default function MyNotifications() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([
    "Your event was flagged",
    "Event has been approved",
  ]);

  const handleClick = () => {
    setOpen(true);
  };

  return (
    <>
      <div className="relative">
        <button
          className="relative ml-auto flex items-center justify-center"
          onClick={handleClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-sky-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405C18.315 14.79 18 13.672 18 12.5V11 
                  a6.002 6.002 0 00-5-5.917V4a2 2 0 10-4 0v1.083
                  A6.002 6.002 0 004 11v1.5c0 1.172-.315 2.29-.895 3.095L2 17h5
                  m8 0a3 3 0 11-6 0m6 0H9"
            />
          </svg>
        </button>
      </div>
      <NotificationDialog
        isOpen={open}
        onClose={() => setOpen(false)}
        notifications={notifications}
      />
    </>
  );
}