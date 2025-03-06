"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Trash, CalendarDays, CalendarHeart } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Notification {
  message: string;
}

interface NotificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onDelete: (index: number) => void;
}

export default function NotificationDialog({
  isOpen,
  onClose,
  notifications,
  onDelete,
}: NotificationDialogProps) {
  const { t  } = useTranslation();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="bg-black/30 flex items-center justify-center" />
        <DialogContent className="mx-auto max-w-lg rounded-lg bg-white p-6 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">
            {t("notif")}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {notifications.length === 0 ? (
              <p className="text-gray-500">{t("nonotif")}</p>
            ) : (
              notifications.map((notification, i) => (
                <div key={i} className="mb-3 border-b pb-2 flex items-center justify-between text-gray-700">
                  <div className="flex items-center">
                    {notification.message.startsWith("Joined") ? (
                      <CalendarHeart className="mr-2 text-sky-800" />
                    ) : (
                      <CalendarDays className="mr-2 text-sky-800" />
                    )}
                    <span>{notification.message}</span>
                  </div>
                  <button onClick={() => onDelete(i)} className="text-red-500 hover:text-red-700">
                    <Trash className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={onClose} variant="default" className="bg-sky-800 text-white">
              Close
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
