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

  if (loading) return <div>Loading flagged posts...</div>;

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
    <div>
      <h1>Admin - Flagged or Pending Posts</h1>
      {posts.length === 0 ? (
        <p>No flagged posts to review.</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} style={{ border: "1px solid #ccc", margin: "10px 0" }}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <button onClick={() => handleApprove(post._id)}>Approve</button><br /> 
            <button onClick={() => handleReject(post._id)}>Reject</button>
          </div>
        ))
      )}
    </div>
  );
}