'use client'
import * as React from "react"
import { signOut } from "next-auth/react";
import { useTranslation } from "react-i18next";

export default function Footer (){
     const { t  } = useTranslation();
    return (
        <>
            <div className="flex flex-row justify-center items-center gap-5 text-slate-700">
                <button className="hover:text-slate-900"><a href="/">{t("home")}</a></button>
                <button className="hover:text-slate-900" >{t("logout")}</button>
                <button className="hover:text-slate-900">{t("terms")}</button>
                <button className="hover:text-slate-900">{t("contact")}</button>
                


            </div>
        </>
    )
}
   