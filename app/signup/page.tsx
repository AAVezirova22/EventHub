"use client"


import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import axios from "axios";
import { useRouter } from "next/navigation"


const signUpValidation = z.object({
  name: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().optional(),
  email: z.string().optional(),  // Remove .email() validation
  password: z.string().optional() // Remove .min() validation
});
export let isAuthentic: boolean = false;



export default function SignUp() {
  const form = useForm<z.infer<typeof signUpValidation>>({
    resolver: zodResolver(signUpValidation),
    defaultValues: {
      name: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof signUpValidation>) {
    console.log(user)
  }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState({
    name: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
  });

  const router = useRouter();
  const handleInputChange = (event: any) => {
    const { name, value} = event.target;
    return setUser((prevInfo) => ({...prevInfo, [name]: value}))
  }
  
  const handleSubmit = async(e:any) => {
    e.preventDefault;
    setLoading(true);
    console.log(user);
    try{
      if(!user.name || !user.lastName || !user.email || !user.password || !user.username ){
        setError("Please, fill all the fields!")
        return;
      }
      const res = await axios.post("/api/register", user);
      console.log(res.data);
      if(res.status == 200 || res.status == 201){
        console.log("user added successfully");
        setError("")
        isAuthentic = true;
        router.push("/")
      }
    }catch(error){
      console.log(error);
      setError("")
    }finally{
      setLoading(false)
      setUser({
        name: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      })
   
    }
  }
 
  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-slate-700 p-5">
        <div className="bg-slate-100 rounded-2xl shadow-lg p-10 max-w-md w-full">
          <Form {...form} >
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">              <h1 className="font-bold text-2xl text-center">Sign up</h1>
              <p className="text-gray-600 text-center">Create a free account with your email.</p>
              <div className="flex flex-row gap-1">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="First Name" type="text"  {...field} onChange={handleInputChange} name="name" value={user.name}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Last Name" type="text" className="shad-input" {...field}  name="lastName" value={user.lastName} onChange={handleInputChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Username"type="text" className="shad-input" {...field}  name="username" value={user.username} onChange={handleInputChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Email Address"type="text" className="shad-input" {...field}  name="email" value={user.email} onChange={handleInputChange} />
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
                      <Input placeholder="Password"  type="password" className="shad-input" {...field} name="password" value={user.password} onChange={handleInputChange}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-center">
              <Button type="submit" className="px-8 bg-slate-700" >{loading ? "Processing...": "Submit"}</Button>
              </div>
              <hr className="border-slate-300"/>
              <p className="text-gray-600 text-center">Already have an account? <a href="/login" className="text-slate-800 font-bold">Log in</a></p>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}

