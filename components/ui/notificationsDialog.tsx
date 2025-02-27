"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

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
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child as={Fragment}>
            <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-4 shadow">
              <Dialog.Title className="font-bold text-lg">Notifications</Dialog.Title>
              <div className="mt-4">
                {notifications.length === 0 ? (
                  <p className="text-gray-500">No notifications yet</p>
                ) : (
                  notifications.map((msg, i) => (
                    <div key={i} className="mb-2 border-b pb-2">
                      {msg}
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={onClose}
                  className="rounded bg-sky-600 px-4 py-2 text-white hover:bg-sky-700"
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}