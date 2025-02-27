"use client"

import { useEffect, useState } from "react"; 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'; 
import { signIn } from "next-auth/react"
import { GoogleLogin } from '@react-oauth/google'; 
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';


const registerValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

export default function Register() {
  const form = useForm<z.infer<typeof registerValidation>>({
    resolver: zodResolver(registerValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");
  const [user, setUser] = useState({
    email: "",
    password: "",
    access_token: "",
  });
  const [ profile, setProfile ] = useState<any>(null);
  // const login = useGoogleLogin({
  //       onSuccess: (codeResponse : any) => setUser(codeResponse),
  //       onError: (error) => console.log('Login Failed:', error)
  //   });
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setUser((prevInfo) => ({ ...prevInfo, [name]: value }))
  };
  useEffect(
    () => {
        if (user) {
            axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        Accept: 'application/json'
                    }
                })
                .then((res) => {
                    setProfile(res.data);
                })
                .catch((err) => console.log(err));
        }
    },
    [ user ]
);

const logOut = () => {
    googleLogout();
    setProfile(null);
};
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (!user.email || !user.password) {
        setError("Please, fill all the fields!")
        return
      }
      const res = await signIn("credentials", {
        email: user.email,
        password: user.password,
        redirect: false,
      })
      if (res?.error) {
        console.log(res)
        setError("Invalid credentials or error signing in!")
        return
      }
      setError("")
      router.push("/")
    } catch (error) {
      console.log(error)
      setError("An unexpected error occurred!")
    } finally {
      setLoading(false)
      setUser({
        email: "",
        password: "",
        access_token: "",
      })
    }
  }
  const responseMessage = async (response: any) => {
    try {
        const userInfo = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${response.access_token}`);
        const { email, name, picture } = userInfo.data;

        const checkUser = await axios.get(`/api/users?email=${email}`);
        
        if (!checkUser.data.exists) {
            // Register new user
            await axios.post("/api/register", {
                name,
                lastName: "", 
                email,
                username: email.split("@")[0], 
                isOAuth: true,  
            });
        }

        await signIn("google");
    } catch (error) {
        console.error("Google login failed:", error);
    }
};

const errorMessage = () => {
    console.log("An error occurred during Google login.");
};
  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-slate-700 p-5">
        <div className="bg-slate-100 rounded-2xl shadow-lg p-10 max-w-md w-full">
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <h1 className="font-bold text-2xl text-center">Log in</h1>
              <p className="text-gray-600 text-center">
                Log in to your account with your email and password.
              </p>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Email Address"
                        type="text"
                        className="shad-input"
                        {...field}
                        name="email"
                        value={user.email}
                        onChange={handleInputChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Password"
                        type="password"
                        className="shad-input"
                        {...field}
                        name="password"
                        value={user.password}
                        onChange={handleInputChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <p className="text-center text-red-600 font-semibold">{error}</p>
              )}

              <div className="text-center">
                <Button type="submit" className="px-8 bg-slate-700">
                  {loading ? "Processing..." : "Submit"}
                </Button>
              </div>

              <hr className="border-slate-300" />

              <p className="text-gray-600 text-center">
                Don't have an account?{" "}
                <a href="/signup" className="text-slate-800 font-bold">
                  Sign up
                </a>
              </p>
            </form>
          </Form>
          <div>
           
            <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
        </div>
        <div>
            
            {profile ? (
                <div>
                    <img src={profile.picture} alt="user image" />
                    <h3>User Logged in</h3>
                    <p>Name: {profile.name}</p>
                    <p>Email Address: {profile.email}</p>
                    <br />
                    <br />
                    <button onClick={logOut}>Log out</button>
                </div>
            ) : (
                <button onClick={() => login()}>Sign in with Google 🚀 </button>
            )}
        </div>
          </div>
          </div>
       
      </>
    );
  }
