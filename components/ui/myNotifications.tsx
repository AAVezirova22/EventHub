"use client";

import { useEffect, useState } from "react";
import NotificationDialog from "./notificationsDialog";
import { Bell, BellDot  } from "lucide-react";

interface Notification {
  message: string;
  icon: string;
}

export default function MyNotifications() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const savedNotifications = localStorage.getItem("notifications");
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  const handleClick = () => {
    setOpen(true);
  };

  const handleDelete = (index: number) => {
    const updatedNotifications = notifications.filter((_, i) => i !== index);
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  };
  const NotificationIcon = notifications.length > 0 ? BellDot : Bell;
  return (
    <>
       <div className="relative">
        <button
          className="relative ml-auto flex items-center justify-center"
          onClick={handleClick}
        >
          <NotificationIcon className="h-8 w-8 text-sky-800" />
        </button>
      </div>
      <NotificationDialog
        isOpen={open}
        onClose={() => setOpen(false)}
        notifications={notifications}
        onDelete={handleDelete}
      />
    </>
  );
}