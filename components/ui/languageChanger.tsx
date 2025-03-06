"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Post from "./post";
import Footer from "@/components/ui/footer";
import { DateTime } from "luxon";
import ThemeChanger from "./themeChanger";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "./button";

export default function LanguageChanger() {

    const { t, i18n } = useTranslation();
    return(
        <>
        
            <DropdownMenu>
                <DropdownMenuTrigger>
                <Button variant="outline">{t("change_language")}</Button>
                   </DropdownMenuTrigger>
                <DropdownMenuContent>
                    
                    <DropdownMenuItem><button onClick={() => i18n.changeLanguage("en")}>English</button></DropdownMenuItem>
                    <DropdownMenuItem><button onClick={() => i18n.changeLanguage("bg")}>Български</button></DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>
                          {/* <button onClick={() => i18n.changeLanguage("en")}>🇬🇧 English</button>
                          <button onClick={() => i18n.changeLanguage("bg")}>🇧🇬 Български</button> */}

        </>
    )
}