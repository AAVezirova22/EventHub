"use client"; 

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/ui/navigation-menu";
import { DateTime } from 'luxon';
import { useEffect, useState } from "react";
import { ProfilePost } from "@/components/ui/post";
import { signOut } from "next-auth/react"
import User from "../models/user";
import { getToken } from "next-auth/jwt";
import { param } from "jquery";
import axios from "axios";


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

  const handleEdit = (field : any) => {
    
  };

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

    const [imageUrl, setImageUrl] = useState<string | null>(null);

    ;

  
const [countries, setCountries] = useState([]);
const [regions, setRegions] = useState([]);
const [fileUrl, setFileUrl] = useState<string | null>(null);

useEffect(() => {
  if(session) {
    const customSession: any = session;
    const { picture } = customSession.accessToken;
    console.log("Client side: ", session)
    setUserSession(session);
    setImageSrc(picture || '');
    setFileUrl(picture || '');
  }
  
  const fetchCountries = async () => {
    try {
      const response = await fetch("https://restcountries.com/v3.1/all");
      const data = await response.json();
      const countryList = data.map((country : any) => ({
        code: country.cca2,
        name: country.name.common,
        region: country.region,
        subregions: country.subregion ? [country.subregion] : [],
      }));
      
      const sortedCountries = countryList.sort((a :any , b : any) => {
        return a.name.localeCompare(b.name);
      });
      setCountries(sortedCountries);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };
  fetchCountries();
}, [session]);

useEffect(() => {
  if(session?.user.email !== "") {
    console.log("email: " , email)
    // getUserById(); 
  }
}, [fileUrl]) 

const [file, setFile] = useState<File | null>(null);

const [previewUrl, setPreviewUrl] = useState<string | null>(session?.user?.image || null);
const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  // const file = event.target.files?.[0];
  // if (file) {
  //   setFile(file);
  //   setPreviewUrl(URL.createObjectURL(file)); // Preview before uploading
  // }
  let file = event.target.files?.[0];
  if (file) {
    toBase64(file).then((res: any) => {
      if(res) {
        setFileUrl(res);
      }
    })
  }
};

// const updateUserData = async () =>  {
// const currentUser: any = await getUserById();
// setFileUrl(currentUser?.image || "");
// }

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

    await fetch("/api/auth/session?update=true"); 

    setPreviewUrl(data.imageUrl); // Update preview
    // updateUserData()
  } catch (error) {
    console.error("Error:", error);
  }
};
// const getUserById = async () => {
  
//   try {
//     // const url: any = "" + new URLSearchParams({ foo: 'value', bar: 2, }).toString();
//     // const response = await fetch("/api/currentUser", {
//     //   method: "POST",
//     //   body: c,
//     //   credentials: "include",
//     // });
//     const body = {
//       email: session?.user.email || ""
//     }
//     if(session?.user.email !== "") {
//       const response = await axios.post("/api/currentUser", body);
//       console.log("Response: ", response)
      
//       if (!response) {
//         throw new Error("Failed to update profile picture");
//       }
//     }
    
//   } catch (error) {
//     console.error("Error:", error);
//   }
// };


const toBase64 = (file:any) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

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
              // src={userSession?.user.image ? userSession?.user.image : "https://cdn.pfps.gg/pfps/2301-default-2.png"}
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
        <section className=" mx-auto my-8 p-6 bg-white rounded-md ">
        <h1 className="text-2xl text-gray-500 font-semibold mb-6">{}</h1>
        <div className="flex gap-5">
            <div className="w-24 h-24 rounded-full mb-4">
            
              <img
              
              src={fileUrl ? fileUrl : "https://cdn.pfps.gg/pfps/2301-default-2.png"}
              className="w-full h-full rounded-full object-cover"
              />
            </div>

             <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="fileInput" /> 
            <button onClick={() => document.getElementById('fileInput')?.click()} className="bg-indigo-700 h-10 text-white px-4 py-2 rounded-3xl cursor-pointer">{session?.user?.image ? "Edit profile pic" :  "Add profile pic"}</button>
        </div>
      <div className="flex gap-5">
        
      {/* First Name */}
      <div className="mb-4 flex gap-5">
  <label className="text-lg mt-2">First Name</label>
  <div className="flex items-center space-x-2">
    <input
      type="text"
      placeholder={session?.user?.name || "First Name"}
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
      placeholder={session?.user?.name || "Last Name"}
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
          {countries.map((country : any) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
        </div>
      </div>

      
      <div className="mb-4 flex gap-5">
        <label className="text-lg mt-2">State/Province/Region</label>
        <div className="flex items-center space-x-2">
          <select
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
            defaultValue=""
            disabled={regions.length === 0}
          >
            <option value="">
              {regions.length > 0 ? "Select a region" : "No regions available"}
            </option>
            {regions.map((region, index) => (
              <option key={index} value={region}>
                {region}
              </option>
            ))}
          </select>
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