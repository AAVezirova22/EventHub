'use client'
import * as React from "react"
import { useEffect, useState } from 'react';
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import "@/app/script"
import { cn } from "@/app/utils"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Button } from "./button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CreateButtonNav, CreateButtonSide } from "./createEvent";
import MyNotifications from "./myNotifications";
import SearchBar from "./searchBar"
import ThemeChanger from "./themeChanger";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "i18next";
import LanguageChanger from "./languageChanger";



const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn(
      "relative z-10 flex max-w-full w-full items-center justify-between",
      className
    )}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
))
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      "group flex flex-1 list-none items-center justify-between space-x-1",
      className
    )}
    {...props}
  />
))
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

const NavigationMenuItem = NavigationMenuPrimitive.Item

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
)

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), "group", className)}
    {...props}
  >
    {children}{" "}
    <ChevronDown
      className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
))
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ",
      className
    )}
    {...props}
  />
))
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

const NavigationMenuLink = NavigationMenuPrimitive.Link

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn("absolute left-0 top-full flex justify-center")}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
))
NavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
  </NavigationMenuPrimitive.Indicator>
))
NavigationMenuIndicator.displayName =
  NavigationMenuPrimitive.Indicator.displayName

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

export default function Navbar() {
 const { t } = useTranslation();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };
  const router = useRouter();
  const { data: session } = useSession();
  let firstName = session?.user?.name;

  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const fetchUserByEmail = async () => {
      try {
        const response = await fetch("/api/currentUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: session?.user?.email }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }

        const data = await response.json();
        if (data.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (session?.user?.email) {
      fetchUserByEmail();
    }
  }, [session?.user?.email]);

  return (
    <>
      <div className="w-full">
      <NavigationMenu className="px-4 flex items-center justify-between w-full">
        <NavigationMenuList className="w-full">
        {/* hamburger menu */}
        <div className="flex-row items-center flex space-x-4 w-full">
          <NavigationMenuItem>
          <div className="flex">
            {/* Sidenav */}
            <nav
                  id="sidenav-1"
                  className={cn(
                    "fixed top-[3rem] left-0 h-[calc(100%-3rem)]",
                    `bg-gradient-to-b to-blue-50 from-white 
                     p-4 transition-transform transform 
                     ${isOpen ? "translate-x-0" : "-translate-x-full"}`
                  )}
                >
                  <ul className="space-y-2 flex flex-col items-center">
                    {session ? (
                      <>
                       
                       <li className="mb-4 w-full text-center">
                          <div className="flex flex-col items-center space-y-2">
                            {/* Avatar */}
                            <Avatar className="h-14 w-14">
                              <AvatarImage
                                src={
                                  user?.image
                                    ? user?.image
                                    : "https://cdn.pfps.gg/pfps/2301-default-2.png"
                                }
                              />
                              <AvatarFallback>
                                {firstName?.at(0)?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>

                            {/* Full name */}
                            <h1 className="text-xl font-semibold">
                              {user?.name + " " + user?.lastName}
                            </h1>

                            {/* Username */}
                            <h2 className="text-lg text-slate-700">
                              @{user?.username}
                            </h2>

                            {/* View Profile link */}
                            <a
                              href="/[userId]"
                              className="text-sky-700 hover:underline text-sm"
                            >
                              {t("viewprofile")}
                            </a>
                          </div>
                        </li>
                        <li className="text-gray-600 font-bold w-full text-center">
                        {t("text1side")} <br /> {t("text2side")}
                        </li>
                        <li>
                          <CreateButtonSide />
                        </li>
                       
                        
                        <li className="text-gray-600 w-full text-center pt-8">
                          <ThemeChanger />
                        </li>
                        <li>
                          <LanguageChanger />
                        </li>
                      </>
                    ) : (
                      <>
                        <h3 className="font-bold text-gray-700 text-center">
                          Nothing here <br /> unless you
                        </h3>
                        <a href="/login">
                          <Button
                            type="submit"
                            className="px-9 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                          >
                            Log in
                          </Button>
                        </a>
                        <h3 className="font-bold text-gray-700">or</h3>
                        <a href="/signup">
                          <Button
                            type="submit"
                            className="px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                          >
                            Sign up
                          </Button>
                        </a>
                      </>
                    )}
                  </ul>
                </nav>


                  {/* Toggler */}
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="navbar-toggler focus:outline-none"
                    aria-controls="navbarToggleExternalContent10"
                    aria-expanded={isOpen}
                    aria-label="Toggle navigation"
                  >
                    <div className="flex flex-col items-center justify-center space-y-[0.15rem]">
                      <span className="block w-8 h-1 rounded bg-slate-400"></span>
                      <span className="block w-8 h-1 rounded bg-slate-400"></span>
                      <span className="block w-8 h-1 rounded bg-slate-400"></span>
                    </div>
                  </button>
                </div>
              </NavigationMenuItem>
              <NavigationMenuItem>
                {/* add icon */}
                <a href="/">
                  <NavigationMenuLink className="font-bold text-2xl ml-3 ">
                    EventHub
                  </NavigationMenuLink>
                </a>
              </NavigationMenuItem>
            </div>
            <div className="flex-row items-center flex w-full justify-end space-x-4">
              <NavigationMenuItem>
                <SearchBar />
              </NavigationMenuItem>
              <NavigationMenuItem>
                {/* search, make into button later */}
                <button>
                  <div className="relative inline-block w-10 h-10 mt-2">
                    <div className="absolute top-1 left-1 w-[1.4rem] h-[1.4rem] border-[0.28rem] border-sky-800 rounded-full"></div>
                    <div className="absolute mr-[0.83rem] mb-[0.6rem]  bottom-0 right-0 w-2 h-[0.35rem] bg-sky-800 transform rotate-45 origin-bottom-right"></div>
                  </div>
                </button>
              </NavigationMenuItem>
              {session ? (
                <>
                  {/* the add button */}
                  <NavigationMenuItem>
                    <CreateButtonNav />
                  </NavigationMenuItem>
                  <div className="flex-row items-center flex space-x-4 ">
                    {/* notification button */}
                    <NavigationMenuItem>
                      <MyNotifications />
                    </NavigationMenuItem>
                    {/* avatar */}
                    <NavigationMenuItem className=" flex  justify-end">
                      <a href="/[userId]"><Avatar className="ml-8 flex items-center  justify-end">
                        <AvatarImage src={user?.image ? user?.image : "https://cdn.pfps.gg/pfps/2301-default-2.png"}></AvatarImage>
                        <AvatarFallback>{firstName?.at(0)?.toUpperCase()}</AvatarFallback>
                        {/* this here ^ are the initials of the person which appear when the avatar does not load */}
                      </Avatar></a>
                    </NavigationMenuItem>
                  </div>
                </>
              ) : (
                <>
                  <a href="/login"><Button type="submit" className="px-9 bg-slate-500 font-bold" >Log in</Button></a>
                  <h3 className="font-bold text-slate-600 ">or</h3>
                  <a href="/signup"><Button type="submit" className="px-8 bg-slate-500 font-bold" >Sign up</Button>  </a>
                </>
              )}
            </div>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </>
  )
}

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
}