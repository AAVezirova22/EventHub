"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const signUpValidation = z.object({
  name: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
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
  });

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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  function onSubmit(values: z.infer<typeof signUpValidation>) {
    console.log("Form values from RHF:", values);
    console.log("Local user state:", user);
  }

  const handleSubmit = async (e: any) => {

    setLoading(true);

    try {
      if (
        !user.name ||
        !user.lastName ||
        !user.email ||
        !user.password ||
        !user.username
      ) {
        setError("Please, fill all the fields!");
        return;
      }

      const res = await axios.post("/api/register", user);
      console.log(res.data);

      if (res.status === 200 || res.status === 201) {
        console.log("User added successfully");
        setError("");
        isAuthentic = true;
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      setError("Something went wrong while registering!");
    } finally {
      setLoading(false);
      setUser({
        name: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
      });
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-slate-700 p-5">
        <div className="bg-slate-100 rounded-2xl shadow-lg p-10 max-w-md w-full">
          <Form {...form}>
            {/* We still wrap the form with <Form>, but use a real <form> element */}
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <h1 className="font-bold text-2xl text-center">Sign up</h1>
              <p className="text-gray-600 text-center">
                Create a free account with your email.
              </p>

              {/* First & Last Name in the same row */}
              <div className="flex flex-row gap-1">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="First Name"
                          type="text"
                          {...field}
                          name="name"
                          value={user.name}
                          onChange={handleInputChange}
                        />
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
                        <Input
                          placeholder="Last Name"
                          type="text"
                          {...field}
                          name="lastName"
                          value={user.lastName}
                          onChange={handleInputChange}
                        />
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
                      <Input
                        placeholder="Username"
                        type="text"
                        {...field}
                        name="username"
                        value={user.username}
                        onChange={handleInputChange}
                      />
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
                      <Input
                        placeholder="Email Address"
                        type="text"
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

              {/* Display any form error messages */}
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
                Already have an account?{" "}
                <a href="/login" className="text-slate-800 font-bold">
                  Log in
                </a>
              </p>
            </form>
          </Form>

          {/* -------------- SIGN UP WITH GOOGLE BUTTON -------------- */}
          <div className="mt-4">
            <Button
              onClick={() =>
                signIn("google", {
                  callbackUrl: "/",
                  prompt: "select_account",
                })
              }
              className="w-full bg-red-500 text-white"
            >
              Sign Up with Google
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}