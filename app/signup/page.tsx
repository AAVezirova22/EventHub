"use client"


import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { Button } from "@/components/ui/button"
import mongoose, { Schema, Document } from 'mongoose';
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

const signUpValidation = z.object({
  name: z.string().min(2, {
    message: "Name is too short.",
  }),
  lastName: z.string().min(2, {
    message: "Last name is too short.",
  }),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})


export interface IUser extends Document {
  name: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}
const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

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
    console.log(values)
  }
  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-slate-700 p-5">
        <div className="bg-slate-100 rounded-2xl shadow-lg p-10 max-w-md w-full">
          <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" >
              <h1 className="font-bold text-2xl text-center">Sign up</h1>
              <p className="text-gray-600 text-center">Create a free account with your email.</p>
              <div className="flex flex-row gap-1">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="First Name" type="text" {...field} />
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
                        <Input placeholder="Last Name" type="text" className="shad-input" {...field} />
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
                      <Input placeholder="Username" type="text" className="shad-input" {...field} />
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
                      <Input placeholder="Password" type="text" className="shad-input" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-center">
              <Button type="submit" className="px-8 bg-slate-700" >Submit</Button>
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