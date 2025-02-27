"use client";

import AuthProvider from "@/components/ui/Provider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (

    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <AuthProvider>
        {children}
      </AuthProvider>
      <Toaster position="top-right" reverseOrder={false} />
    </GoogleOAuthProvider>
  );
}