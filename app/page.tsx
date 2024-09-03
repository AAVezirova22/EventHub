"use client"; // Mark this component as a Client Component

import Navbar from "../components/ui/navigation-menu";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Navbar />
    </>
  );
}
