"use client"; // Mark this component as a Client Component

import Navbar from "../components/ui/navigation-menu";
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const {data:session} = useSession();
  return (
    <>
      <Navbar />
      {session && <span>{session.user?.name}</span>}
    </>
  );
}
