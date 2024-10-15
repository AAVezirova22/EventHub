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
import { isAuthentic as importedIsAuthentic} from "../signup/page";

let isAuthentic = importedIsAuthentic;

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

  const [error, setError] = useState<string | null>(null); // State for error messages
  const router = useRouter(); // Initialize router

  // Declare onSubmit as async
  async function onSubmit(values: z.infer<typeof registerValidation>) {
    console.log(values); // Log the input values for debugging
    
    try {
      const response = await fetch('/api/login', { // Adjust the path based on your API route
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: "login", // Indicate this is a login action
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json(); // Parse the response

      if (response.ok) {
        // Handle successful login (e.g., redirect to a dashboard, store a token, etc.)
        console.log('Login successful:', data);
        isAuthentic = true;

        router.push('/'); // Change this to your desired route
        setError(null); // Clear any previous errors
      } else {
        // Handle errors (e.g., show an error message)
        console.error('Login failed:', data.error);
        setError(data.error); // Set the error message
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setError("An unexpected error occurred."); // Optional error message for unexpected errors
    }
  }

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-slate-700 p-5">
        <div className="bg-slate-100 rounded-2xl shadow-lg p-10 max-w-md w-full">
          <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" >
              <h1 className="font-bold text-2xl text-center">Log in</h1>
              <p className="text-gray-600 text-center">Log in your account with your email and password.</p>
              
              {error && <p className="text-red-600 text-center">{error}</p>} {/* Show error message */}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Email Address" type="text" className="shad-input" {...field} />
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
                      <Input placeholder="Password" type="password" className="shad-input" {...field} />
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
