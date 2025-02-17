"use client"; 

import Navbar from "../components/ui/navigation-menu";
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import Dashboard from "@/components/ui/dashboard";


export default function Home() {
  const router = useRouter();
  const {data:session} = useSession();
  return (
    <>
      <Navbar />
      {session ? <Dashboard />: null}
      
    </>
  );
}
