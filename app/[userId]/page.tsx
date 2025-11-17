"use client"; 

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/ui/navigation-menu";
import { DateTime } from 'luxon';
import { use, useEffect, useState } from "react";
import ProfilePost from "@/components/ui/post";
import { signOut } from "next-auth/react"
import Link from "next/link";
import User from "../models/user";
import { getToken } from "next-auth/jwt";
import { param } from "jquery";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import Footer from "@/components/ui/footer";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { toast } from "sonner";


export default function UserProfile() {
  const router = useRouter();
  const {data:session} = useSession();
  const [userSession, setUserSession] = useState(Object);
  const [imageSrc, setImageSrc] = useState('');
  // const token = getToken({req: param});
  const [posts, setPosts] = useState<any[]>([]);
  const [attendingEvents, setAttendingEvents] = useState<any[]>([]);
  const userId = session?.user?.id;
    const [currentIndex, setCurrentIndex] = useState(0); 
    const [openSettings, setOpenSettings] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("********");
    const [country, setCountry] = useState("");
    const [state, setState] = useState("");
    const [birthday, setBirthday] = useState({
      day: "01",
      month: "December",
      year: "1994",
    });
    const [receiveEmails, setReceiveEmails] = useState(false);
    const [countries, setCountries] = useState([]);
    
    const [fileUrl, setFileUrl] = useState<string | null>(null);

  const handleEdit = (field : any) => {
    
  };
    // fetch all events
    useEffect(() => {
        const fetchPosts = async () => {
          try {
            const res = await fetch("/api/eventCreation");
            if (!res.ok) throw new Error("Failed to fetch events");
            const data = await res.json();
            setPosts(data.events || []); 

            const userAttendingEvents = data.events?.filter(
              (event: any) => event.attendees?.includes(userId)
          ) || [];
          setAttendingEvents(userAttendingEvents);
          } catch (error) {
            console.error(error);
          }
        };
        if (userId) {
          fetchPosts();
      }
      
        fetchPosts();
      }, [userId]);
    //filter events created by user
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
    // manage page counter and user status
    let eventCounter = filteredEvents.length;
    let userStatus = "";
    if(eventCounter === 0) {
      userStatus = "Newbie";
    }
    else if(eventCounter > 0 && eventCounter < 5) {
      userStatus = "Rising Star";
    }
    else if(eventCounter >= 5 && eventCounter < 10) {
      userStatus = "Entusiast";
    }
    else if(eventCounter >= 10 && eventCounter < 15) {
      userStatus = "Event Architect";
    }
    else if(eventCounter >= 15) {
      userStatus = "Legend";
    }
    

    
    useEffect(() => {
      if(session) {
        const customSession: any = session;
        const { picture } = customSession.accessToken;
        console.log("Client side: ", session)
        setUserSession(session);
        setImageSrc(picture || '');
        setFileUrl(picture || '');
        }
      }, [session]);
        
        // manage country in settings

        const [selectedCountry, setSelectedCountry] = useState(null);
        const [region, setRegion] = useState(null);
      
        useEffect(() => {
          const fetchCountries = async () => {
            try {
              const response = await fetch("https://restcountries.com/v3.1/all");
              const data = await response.json();
          
              const countryList = data.map((country: any) => ({
                code: country.cca2,
                name: country.name.common,
                subregions: country.subregion ? [country.subregion] : [],
              }));
          
              const sortedCountries = countryList.sort((a: any, b: any) =>
                a.name.localeCompare(b.name)
              );
          
              setCountries(sortedCountries);
            } catch (error) {
              console.error("Error fetching countries:", error);
            }
          };
          
          fetchCountries();
        }, []);
      
        const handleCountrySelect = async (countryName: string) => {
          try {
            const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
            const data = await response.json();
          
            // Check if country exists
            if (data.length > 0) {
              const selectedCountry = data[0];
              setSelectedCountry(selectedCountry.name.common);
              setRegion(selectedCountry.region);  // Get the region here
            } else {
              console.log("Country not found.");
            }
          } catch (error) {
            console.error("Error fetching country data:", error);
          }
        };
useEffect(() => {

  handleCountrySelect(country);
}, [country]);

useEffect(() => {
  if(session?.user.email !== "") {
    console.log("email: " , email)
    // getUserById(); 
  }
}, [fileUrl]) 

const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {

  let file = event.target.files?.[0];
  if (file) {
    toBase64(file).then((res: any) => {
      if(res) {
        setFileUrl(res);
      }
    })
  }
};



const handleUpload = async () => {
  if (!fileUrl) return;
  
  const formData = new FormData();
  formData.append("image", fileUrl || "");
  const body = JSON.stringify({email: session?.user.email, image: fileUrl});
  try {
    const response = await fetch("/api/register", {
      method: "PATCH",
      body: body,
    });

    if (!response.ok) {
      throw new Error("Failed to update profile picture");
    }

    const data = await response.json();
    console.log("Profile pic updated:", data);
    toast("Profile picture updated!");
    await fetch("/api/auth/session?update=true"); 
  } catch (error) {
    console.error("Error:", error);
  }
};


const toBase64 = (file:any) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});
const [user, setUser] = useState<any>(null);
useEffect(() => {
  const fetchUserByEmail = async () => {
    try {
      const response = await fetch("/api/currentUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session?.user?.email }), 
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      const data = await response.json();
      if (data.user) {
        setUser(data.user); 
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  if (session?.user?.email) {
    fetchUserByEmail();
  }
}, [session?.user?.email]); 



    return(
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-200 flex justify-center items-center p-8">
            <div className="bg-white shadow-lg rounded-xl w-full max-w-8xl flex p-16 h-full max-h-8xl">
        {/* left side */}
        
        <aside className="w-1/4 border-r p-4 flex flex-col items-center">
        <h2 className="text-xl text-gray-500 font-semibold mb-2">Your profile</h2>
        <h1 className="text-xl font-semibold mb-4">{user?.role == "admin" ? "- admin -" : ""}</h1>
        <div className="w-24 h-24 rounded-full mb-4">
          
            <img
              src={user?.image ? user?.image  : "https://cdn.pfps.gg/pfps/2301-default-2.png"}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          
          <h1 className="text-xl font-semibold">{user?.name + " " + user?.lastName}</h1>
          <h2 className="text-lg text-slate-700 ">@{user?.username}</h2>
          <HoverCard>
  <HoverCardTrigger className="text-gray-500 text-sm mb-4 underline">{userStatus}</HoverCardTrigger>
  <HoverCardContent className="bg-white text-slate-600 p-4 rounded-md shadow-lg">
    <div>
      <span role="img" aria-label="flower">✿</span> <strong>Newbie</strong> - Starting your journey. 0 events created. Keep pushing!
    </div>
    <div>
      <span role="img" aria-label="star">✿ ✿</span> <strong>Rising Star</strong> - You’re on the rise! 1–4 events created. Let’s keep this momentum going!
    </div>
    <div>
      <span role="img" aria-label="fire">✿ ✿ ✿</span> <strong>Enthusiast</strong> - You love what you do! 5–9 events created. The passion is real.
    </div>
    <div>
      <span role="img" aria-label="blueprint">✿ ✿ ✿ ✿</span> <strong>Event Architect</strong> - Crafting experiences! 10–14 events created. You're shaping the scene.
    </div>
    <div>
      <span role="img" aria-label="crown">✿ ✿ ✿ ✿ ✿</span> <strong>Legend</strong> - A force to be reckoned with! 15+ events created. You’re an icon in the making.
    </div>
  </HoverCardContent>
</HoverCard>

          {/* work on this pleaseee */}

          <p className="text-xl font-bold">{eventCounter}</p>
          <p className="text-gray-500 text-sm mb-4">events created</p>

          {/* <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="fileInput" /> */}
          <button onClick={() => setOpenSettings(!openSettings)} className="bg-indigo-700 text-white px-4 py-2 rounded-3xl cursor-pointer">{openSettings ? "Done" :  "Edit profile"}</button>
          <a href="/signup"><button onClick={() => signOut()} className="mt-2 text-gray-500 border px-4 py-2 rounded-3xl">Sign out</button></a>
        </aside>
         {/* IF settings are open */}
        {openSettings ? 
       
        <>
        {/* Right Side - Events Section */}
        <section className=" mx-auto my-8 p-6 bg-white rounded-md ">
        <h1 className="text-2xl text-gray-500 font-semibold mb-6">{}</h1>
        <div className="flex gap-5">
            <div className="w-24 h-24 rounded-full mb-4">
            
              <img
              
              src={fileUrl ? fileUrl  : user?.image}
              className="w-full h-full rounded-full object-cover"
              />
            </div>

             <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="fileInput" /> 
            <button onClick={() => document.getElementById('fileInput')?.click()} className="bg-indigo-700 h-10 text-white px-4 py-2 rounded-3xl cursor-pointer">{user?.image ? "Edit profile pic" :  "Add profile pic"}</button>
        </div>
      <div className="flex gap-5">
        
      {/* First Name */}
      <div className="mb-4 flex gap-5">
  <label className="text-lg mt-2">First Name</label>
  <div className="flex items-center space-x-2">
    <input
      type="text"
      placeholder={user?.name || "First Name"}
      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
    />
  </div>
</div>
 {/* Last Name */}
 <div className="mb-4 flex gap-5">
  <label className="text-lg mt-2">Last Name</label>
  <div className="flex items-center space-x-2">
    <input
      type="text"
      placeholder={user?.lastName || "Last Name"}
      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
    />
  </div>
</div>
</div>
      {/* Email */}
      <div className="mb-4 flex gap-5">
        <label className="text-lg mt-2">Email</label>
        <div className="flex items-center space-x-2">
          <input
            type="email"
            placeholder={user?.email || "Email"}
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
          {countries.map((country : any) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
        </div>
      </div>

      
       {selectedCountry && region && (
        <div>
          <h3>{selectedCountry}</h3>
          <p>Region: {region}</p>
        </div>
      )}

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
          <button onClick={handleUpload} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Save
          </button>
        </div>
      </div>
    </section>
      </>
        :  <>
        {/* Right Side - Events Section */}
        <section className=" mx-auto my-8 p-6 bg-white rounded-md ">
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

        <Link href={"/created-events"}>
        <button className="text-blue-500 hover:underline mt-3">
          Show All
        </button>
      </Link>

        {/* **Attending Events Section** */}
        <div>
          <h3 className="text-md font-medium mb-2">Attending</h3>
          <div className="flex flex-wrap gap-4">
            {attendingEvents.length > 0 ? (
              attendingEvents.map((event) => (
                <ProfilePost key={event._id} post={event} />
                ))
              ) : (
                <p className="text-gray-500">No attending events yet.</p>
              )}
            </div>
          </div>
      </section>
      </>}
        
      </div>
    </div>
 
        </>
    )

}