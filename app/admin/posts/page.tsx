"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminPostsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userRole = (session?.user as { role?: string })?.role;

    if (userRole && userRole !== "admin") {
      router.replace("/");
    }
  }, [session, router]);

  useEffect(() => {
    const fetchFlaggedPosts = async () => {
      try {
        const res = await fetch("/api/admin/flagged-posts");
        const data = await res.json();
        setPosts(data.posts || []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch flagged posts", error);
      }
    };

    fetchFlaggedPosts();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Loading flagged posts...
      </div>
    );

  const handleApprove = async (postId: string) => {
    try {
      await fetch(`/api/posts/${postId}/approve`, {
        method: "PATCH",
      });

      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (error) {
      console.error("Error approving post:", error);
    }
  };

  const handleReject = async (postId: string) => {
    try {
      await fetch(`/api/posts/${postId}/reject`, {
        method: "PATCH",
      });

      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (error) {
      console.error("Error rejecting post:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-slate-800 text-center mb-6">
        Admin - Flagged Posts
      </h1>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No flagged posts to review.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
            >
              <h2 className="text-lg font-semibold text-gray-800">{post.title}</h2>
              <p className="text-gray-600 mt-2">{post.content}</p>

              <div className="flex justify-end space-x-4 mt-4">
                <button
                  onClick={() => handleApprove(post._id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(post._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}