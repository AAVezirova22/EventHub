"use client"; 

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/ui/navigation-menu";
import { DateTime } from 'luxon';
import { useEffect, useState } from "react";
import { ProfilePost } from "@/components/ui/post";
import { signOut } from "next-auth/react"

export default function UserProfile() {
    const router = useRouter();
    const {data:session} = useSession();
    const [posts, setPosts] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0); 
    const [openSettings, setOpenSettings] = useState(false);
    const [email, setEmail] = useState("example@gmail.com");
    const [password, setPassword] = useState("********");
    const [country, setCountry] = useState("");
    const [state, setState] = useState("");
    const [birthday, setBirthday] = useState({
      day: "01",
      month: "December",
      year: "1994",
    });
    const [receiveEmails, setReceiveEmails] = useState(false);

  const handleEdit = (field : any) => {
    
  };

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
                setImageUrl(data.imageUrl);
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
        <h2 className="text-xl text-gray-500 font-semibold mb-2">Your profile</h2>
        <div className="w-24 h-24 rounded-full mb-4">
          
            <img
              src={session?.user?.image ? session.user.image : "https://cdn.pfps.gg/pfps/2301-default-2.png"}
              alt="User Avatar"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <h2 className="text-lg font-semibold">{session?.user?.name}</h2>
          <p className="text-gray-500 text-sm mb-4">Enthusiast</p> 
          {/* work on this pleaseee */}

          <p className="text-xl font-bold">10</p>
          <p className="text-gray-500 text-sm mb-4">events created</p>

          {/* <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="fileInput" /> */}
          <button onClick={() => setOpenSettings(!openSettings)} className="bg-indigo-700 text-white px-4 py-2 rounded-3xl cursor-pointer">{openSettings ? "Done" :  "Edit profile"}</button>
          <a href="/signup"><button onClick={() => signOut()} className="mt-2 text-gray-500 border px-4 py-2 rounded-3xl">Sign out</button></a>
        </aside>
        {openSettings ? 
        <>
        {/* Right Side - Events Section */}
        <section className="max-w-lg mx-auto my-8 p-6 bg-white rounded-md ">
        <h1 className="text-2xl text-gray-500 font-semibold mb-6">Edit your personal information</h1>
      
      {/* Full Name */}
      <div className="mb-4 flex gap-5">
  <label className="text-lg mt-2">Full Name</label>
  <div className="flex items-center space-x-2">
    <input
      type="text"
      placeholder={session?.user?.name || "Full Name"}
      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
    />
  </div>
</div>

      {/* Email */}
      <div className="mb-4 flex gap-5">
        <label className="text-lg mt-2">Email</label>
        <div className="flex items-center space-x-2">
          <input
            type="email"
            placeholder="example@gmail.com"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
          />
        </div>
      </div>

      {/* Password */}
      <div className="mb-4 flex gap-5">
        <label className="text-lg mt-2">Password</label>
        <div className="flex items-center space-x-2">
          <input
            type="password"
            placeholder="********"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
          />
        </div>
      </div>

      {/* Country */}
      <div className="mb-4 flex gap-5">
        <label className="text-lg mt-2">Country</label>
        <div className="flex items-center space-x-2">
          <select
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
            defaultValue=""
          >
            <option value="">Not chosen</option>
            <option value="USA">United States</option>
            <option value="Canada">Canada</option>
            {/* Add more countries as needed */}
          </select>
        </div>
      </div>

      {/* State/Province/Region */}
      <div className="mb-4 flex gap-5">
        <label className="text-lg mt-2">State/Province/Region</label>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Type here"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
          />
        </div>
      </div>

      {/* Birthday */}
      <div className="mb-4 flex gap-5">
        <label className="text-lg mt-2">Birthday</label>
        <div className="flex items-center space-x-2">
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
            defaultValue=""
          >
            <option value="">Day</option>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
            defaultValue=""
          >
            <option value="">Month</option>
            {[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
            defaultValue=""
          >
            <option value="">Year</option>
            {/* Example range: 1985 - 2024 */}
            {Array.from({ length: 40 }, (_, i) => 1985 + i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Subscription Checkbox */}
      <div className="mb-4 flex gap-5">
        <label className="text-lg mt-2">Subscription</label>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="h-4 w-4"
          />
          <span className="text-sm">I agree to receive emails from EventHub</span>
        </div>
      </div>

      {/* Save Button */}
      <div className="mb-4 flex gap-5">
        {/* Empty label just for layout consistency */}
        <label className="text-lg mt-2"></label>
        <div className="flex items-center space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Save
          </button>
        </div>
      </div>
    </section>
      </>
        :  <>
        {/* Right Side - Events Section */}
        <section className="w-3/4 p-4">
        <h2 className="text-xl text-gray-500 font-semibold mb-2">Your events</h2>

        {/* Created Events */}
        <div className="mb-6">
          <h3 className="text-md font-medium mb-2">Created</h3>
          <div className="flex items-center gap-2">
          <button onClick={prevPage} disabled={currentIndex === 0} className={`text-2xl font-bold ${currentIndex === 0 ? 'text-gray-400 ' : 'text-slate-500  hover:text-slate-700'}`} >&lt;</button>
          {paginatedEvents.slice().reverse().map((post) => (
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
      </>}
        
      </div>
    </div>
  
        </>
    )

}