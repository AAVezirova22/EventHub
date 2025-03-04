"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
  DialogOverlay, // Correct import for overlay
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "../ui/button"; // Assuming you have a custom button component

interface NotificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: string[];
}

export default function NotificationDialog({
  isOpen,
  onClose,
  notifications,
}: NotificationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        {/* Dialog overlay (background dimming) */}
        <DialogOverlay className="  bg-black/30 flex items-center justify-center" />

        {/* Centering dialog content */}
        <DialogContent className=" mx-auto max-w-lg rounded-lg bg-white p-6 shadow-lg">
          <div>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-800">Notifications</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {notifications.length === 0 ? (
                <p className="text-gray-500">No notifications yet</p>
              ) : (
                notifications.map((msg, i) => (
                  <div key={i} className="mb-3 border-b pb-2 text-gray-700">
                    {msg}
                  </div>
                ))
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={onClose} variant="default" className="bg-sky-800 text-white">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}