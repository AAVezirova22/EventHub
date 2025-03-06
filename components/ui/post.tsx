"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { CalendarDays } from "lucide-react";
import ThemeChanger from "./themeChanger";
import { useTranslation } from "react-i18next";
interface PostProps {
  post: {
    _id: string;
    title: string;
    startDate: string;
    description: string;
    image?: string;
    createdByImage?: string;
    createdByName?: string;
    attending?: number;
  };
  hideComment?: boolean;
}

interface Comment {
  _id: string;
  userId: string;
  userName: string;
  userImage: string;
  text: string;
  createdAt: string;
}

export default function Post({ post }: PostProps) {
  const { t  } = useTranslation();
  const dt = DateTime.now();
  const { data: session } = useSession();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/events/${post._id}/comments`);
        if (!res.ok) throw new Error("Failed to fetch comments");
        const data = await res.json();
        setComments(data.comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    if (showComments) {
      fetchComments();
    }
  }, [showComments, post._id]);

  function calcTimeLeft() {
    const startDateTime = DateTime.fromISO(post.startDate);
    const diffInDays = startDateTime.diff(dt, "days").days;
    const diffInHours = startDateTime.diff(dt, "hours").hours;

    if (diffInDays >= 1) {
      return `${Math.floor(diffInDays)} ${Math.floor(diffInDays) > 1 ? t("dayss") : t("day")}`;
    } else if (diffInDays < 1 && diffInHours >= 1) {
      return `${Math.floor(diffInHours)} hour${Math.floor(diffInHours) > 1 ? "s" : ""}`;
    } else {
      return t("less1hour");
    }
  }

  const addNotification = (newMessage: string, icon: string) => {
    const savedNotifications = localStorage.getItem("notifications");
    const notifications = savedNotifications ? JSON.parse(savedNotifications) : [];

    const newNotification = { message: newMessage, icon };

    if (!notifications.some((notification: any) => notification.message === newMessage)) {
      const updatedNotifications = [...notifications, newNotification];
      localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    }
  };

  useEffect(() => {
    if (calcTimeLeft() === " less than 1 hour") {
      addNotification(post.title + " by " + post.createdByName + " starting soon!", "CalendarDays");
    }
    if (calcTimeLeft() === "1 day") {
      addNotification(post.title + " by " + post.createdByName + " starting tomorrow!", "CalendarDays");
    }
    if (calcTimeLeft() === "10 days") {
      const notificationMessage = post.title + " by " + post.createdByName + " starting in 10 days!";
      const savedNotifications = localStorage.getItem("notifications");
      const notifications = savedNotifications ? JSON.parse(savedNotifications) : [];

      if (!notifications.some((notification: any) => notification.message === notificationMessage)) {
        toast(notificationMessage, {
          description: "Plan the outfit and check the weather!",
          icon: <CalendarDays />,
        });
        addNotification(notificationMessage, "CalendarDays");
      }
    }
  }, []);

  const handleAddComment = async () => {
    if (!session?.user || !newComment.trim()) return;

    const userId = session.user.id;
    const userName = session.user.name || "Anonymous";
    const userImage = session.user.image || "https://cdn.pfps.gg/pfps/2301-default-2.png";

    try {
      const res = await fetch(`/api/events/${post._id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newComment, userId, userName, userImage }),
      });

      if (!res.ok) throw new Error("Failed to add comment");

      const data = await res.json();

      setComments((prevComments) => [...prevComments, data.comment]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="border border-gray-300 shadow-md rounded-lg p-4 mb-4">
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-60 object-cover rounded-lg mb-2"
        />
      )}
      <p className="text-slate-600 font-bold text-xl">
        {post.title.charAt(0).toUpperCase() + post.title.slice(1)} {t("in")} {calcTimeLeft()} | {post.attending ?? "0"} {t("participants")}
      </p>
      <p className="text-slate-500 mt-2">{post.description}</p>

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center">
          <img
            src={post.createdByImage || "https://cdn.pfps.gg/pfps/2301-default-2.png"}
            alt="Created By"
            className="w-10 h-10 rounded-full mr-3"
          />
          <p className="text-slate-600 font-bold">{post.createdByName}</p>
        </div>

        <Link href={`/events/${post._id.toString()}`}>
          <button className="bg-sky-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-800">
          {t("moreinfo")}
          </button>
        </Link>
      </div>

      <button
        className="mt-3 text-sky-700 font-semibold hover:underline"
        onClick={() => setShowComments(!showComments)}
      >
        {showComments ? t("closecomment") : t("writecomment")}
      </button>

      {showComments && (
        <div className="mt-3 border-t border-gray-300 pt-3">
          <div className="max-h-40 overflow-y-auto bg-gray-100 p-3 rounded-md">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="flex items-start space-x-3 border-b py-2">
                  <img
                    src={comment.userImage}
                    alt="User"
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-bold">{comment.userName}</p>
                    <p className="text-slate-600 text-sm">{comment.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">{t("nocomment")}</p>
            )}
          </div>

          <div className="mt-2 flex items-center">
            <input
              type="text"
              placeholder={t("writecomment")}
              className="border rounded-md px-3 py-1 w-full text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              className="ml-2 bg-sky-700 text-white px-3 py-1 rounded-md hover:bg-sky-800"
              onClick={handleAddComment}
            >
              {t("post")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}