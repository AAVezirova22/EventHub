"use client"

import { useState } from "react"; // Import useState
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
import { useRouter } from 'next/navigation'; // Import useRouter
import { signIn } from "next-auth/react";


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
  });

  const handleInputChange = (event: any) => {
    const { name, value} = event.target;
    return setUser((prevInfo) => ({...prevInfo, [name]: value}))
  }

  const handleSubmit = async(e:any) =>{
    e.preventDefault()
    setLoading(true)
    try{
      if(!user.email || !user.password){
        setError("Please, fill all the fields!")
        return;
      }
      const res = await signIn("credentials", {
        email:user.email,
        password:user.password,
        redirect:false
      });
      if(res?.error){
        console.log(res);
        setError("error")
      
      }
      setError("")
        router.push("/")
     
    }catch(error){
      console.log(error);
      setError("")
    }finally{
      setLoading(false)
      setUser({
       
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
            <form onSubmit={handleSubmit} className="space-y-4" >
              <h1 className="font-bold text-2xl text-center">Log in</h1>
              <p className="text-gray-600 text-center">Log in your account with your email and password.</p>
              

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
                <Button type="submit" className="px-8 bg-slate-700">Submit</Button>
              </div>
              <hr className="border-slate-300"/>
              <p className="text-gray-600 text-center">Don't have an account? <a href="/signup" className="text-slate-800 font-bold">Sign up</a></p>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
