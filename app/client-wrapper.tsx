"use client";

import AuthProvider from "@/components/ui/Provider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import { I18nextProvider } from "react-i18next";
import i18n from "@/public/i18n"; 

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID!}>
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster position="top-right" reverseOrder={false} />
      </I18nextProvider>
    </GoogleOAuthProvider>
  );
}