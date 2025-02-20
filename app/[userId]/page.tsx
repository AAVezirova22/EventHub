"use client"; 

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/ui/navigation-menu";
import { DateTime } from 'luxon';
import { useEffect, useState } from "react";
import { ProfilePost } from "@/components/ui/post";

export default function UserProfile() {
    const router = useRouter();
    const {data:session} = useSession();
    const [posts, setPosts] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0); 
    
    useEffect(() => {
        const fetchPosts = async () => {
          try {
            const res = await fetch("/api/eventCreation");
            if (!res.ok) throw new Error("Failed to fetch events");
            const data = await res.json();
            setPosts(data.events || []); 
          } catch (error) {
            console.error(error);
          }
        };
      
        fetchPosts();
      }, []);
    
      const filteredEvents = posts.filter((event) => {
        return event.createdByName == session?.user?.name ;
      });
      const eventsPerPage = 2;
      const paginatedEvents = filteredEvents.slice(currentIndex, currentIndex + eventsPerPage);
      const nextPage = () => {
        if (currentIndex + eventsPerPage < filteredEvents.length) {
            setCurrentIndex(currentIndex + eventsPerPage);
        }
    };

    const prevPage = () => {
        if (currentIndex - eventsPerPage >= 0) {
            setCurrentIndex(currentIndex - eventsPerPage);
        }
    };

    const [file, setFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
          setFile(event.target.files[0]);
      }
  };

  const handleUpload = async () => {
    if (file) {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setImageUrl(data.imageUrl); // Assuming the server returns the image URL
            } else {
                console.error("Upload failed");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    }
};
    return(
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-200 flex justify-center items-center p-8">
            <div className="bg-white shadow-lg rounded-xl w-full max-w-8xl flex p-16 h-full max-h-8xl">
        {/* left side */}
        <aside className="w-1/4 border-r p-4 flex flex-col items-center">
        <div className="w-24 h-24 bg-gray-300 rounded-full mb-4">
                            {imageUrl && <img src={imageUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />}
                        </div>
          <h2 className="text-lg font-semibold">{session?.user?.name}</h2>
          <p className="text-gray-500 text-sm mb-4">Enthusiast</p>

          <p className="text-xl font-bold">10</p>
          <p className="text-gray-500 text-sm mb-4">events created</p>

          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="fileInput" />
          <label htmlFor="fileInput" className="bg-indigo-700 text-white px-4 py-2 rounded-3xl cursor-pointer">Upload new avatar</label>
          <button className="mt-2 text-gray-500 border px-4 py-2 rounded-3xl">Delete</button>
        </aside>

        {/* Right Side - Events Section */}
        <section className="w-3/4 p-4">
          <h2 className="text-lg font-semibold mb-2">Your events</h2>

          {/* Created Events */}
          <div className="mb-6">
            <h3 className="text-md font-medium mb-2">Created</h3>
            <div className="flex items-center gap-2">
            <button onClick={prevPage} disabled={currentIndex === 0} className={`text-2xl font-bold ${currentIndex === 0 ? 'text-gray-400 ' : 'text-slate-500  hover:text-slate-700'}`} >&lt;</button>
            {paginatedEvents.map((post) => (
            <ProfilePost key={post._id} post={post} />
            ))}
              <button onClick={nextPage} disabled={currentIndex + eventsPerPage >= filteredEvents.length} className={`text-2xl font-bold ${currentIndex + eventsPerPage >= filteredEvents.length ? 'text-gray-400 ' : 'text-slate-500  hover:text-slate-700'}`}>&gt;</button>                       
            </div>
          </div>

          {/* Attending Events */}
          <div>
            <h3 className="text-md font-medium mb-2">Attending</h3>
            <div className="flex items-center gap-2">
              
            </div>
          </div>
        </section>

      </div>
    </div>
  
        </>
    )

}