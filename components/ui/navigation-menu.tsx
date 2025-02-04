'use client'
import * as React from "react"
import  { useEffect } from 'react';
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { useState } from "react";
import "@/app/script"
import { cn } from "@/app/utils"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import {  AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Button } from "./button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import createEvent from "./createEvent";
import CreateEvent from "./createEvent";


const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn(
      "relative z-10 flex max-w-max flex-1 items-center justify-center",
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
      "group flex flex-1 list-none items-center justify-center space-x-1",
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


export default function Navbar (){

const [isOpen, setIsOpen] = useState(false);

  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleNavbar = () => {
   
    setIsCollapsed(!isCollapsed);
  };
  const router = useRouter();
  const {data:session} = useSession();

  return(
    <>
      <NavigationMenu className="px-4 flex items-center justify-between">
        <NavigationMenuList>
          {/* hamburger menu */}
        <div className="flex-row items-center flex space-x-4">
          <NavigationMenuItem >
          <div className="flex">
      {/* Sidenav */}
      <nav
        id="sidenav-1"
        className={`fixed top-[3rem] left-0 h-[calc(100%-3rem)] bg-white p-4 transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <ul className="space-y-2 flex flex-col items-center">
           {session ? (
            <>
          <li>
             {/* the add button */}
             <button className="bg-slate-400 flex items-center justify-center rounded h-[3rem] w-[5.5rem]" >
              <div className="text-slate-600 text-[1.2rem] font-extrabold flex items-center justify-center">
                New
              </div>
            </button>
          </li>
          <li className="text-slate-400">
            <div className="flex items-center cursor-pointer">
              <i className="fas fa-grin mr-3"></i>
              <span>Category 1</span>
            </div>
            <ul className="ml-6 mt-2 space-y-2">
              <li className="text-slate-400">
                <span>Link 2</span>
              </li>
              <li className="text-slate-400">
                <span>Link 3</span>
              </li>
            </ul>
          </li>
          <li className="text-slate-400">
            <div className="flex items-center cursor-pointer">
              <i className="fas fa-grin-wink mr-3"></i>
              <span>Category 2</span>
            </div>
            <ul className="ml-6 mt-2 space-y-2">
              <li className="text-slate-400">
                <span>Link 4</span>
              </li>
              <li className="text-slate-400">
                <span>Link 5</span>
              </li>
            </ul>
          </li>
          </>
 ): (
  <>
  <h3 className="font-bold text-slate-600 text-center">Nothing here <br /> unless you</h3>
    <a href="/login"><Button type="submit" className="px-9 bg-slate-500 font-bold" >Log in</Button></a>
    <h3 className="font-bold text-slate-600 ">or</h3>
    <a href="/signup"><Button type="submit" className="px-8 bg-slate-500 font-bold " >Sign up</Button>  </a>
  </>
 )}
        </ul>
      </nav>

      {/* Toggler */}
    
        
        <button
  onClick={() => setIsOpen(!isOpen)}  // Correct handler for hamburger menu
  className="navbar-toggler focus:outline-none"
  aria-controls="navbarToggleExternalContent10"
  aria-expanded={isOpen}  // Adjust to reflect the state
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
            <Link href="#" legacyBehavior passHref>
              <NavigationMenuLink className="font-bold text-sky-800 text-2xl ml-3">
                EventHub
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          </div>
          <div className="flex-row items-center flex">
          <NavigationMenuItem>
            {/* search box */}
          <input 
            type="search" 
            placeholder="Search..."
            className="w-[30rem] text-[0.8rem] text-slate-600 font-bold ml-[25rem] px-4 py-[0.3rem] border-[0.15rem] border-gray-300 rounded-3xl focus:outline-none focus:ring-0 focus:border-gray-300 shadow"
          />
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
         
          
          {/* gotta fix this */}
         

            {session ? (
              <>
               {/* the add button */}
                <NavigationMenuItem>
                  <CreateEvent />
                </NavigationMenuItem>
              
              <div className="flex-row items-center flex space-x-4 ">
                {/* notification button */}
                <NavigationMenuItem className="relative">
                  <button className="relative ml-auto flex items-center justify-center ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-sky-800"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 17h5l-1.405-1.405C18.315 14.79 18 13.672 18 12.5V11a6.002 6.002 0 00-5-5.917V4a2 2 0 10-4 0v1.083A6.002 6.002 0 004 11v1.5c0 1.172-.315 2.29-.895 3.095L2 17h5m8 0a3 3 0 11-6 0m6 0H9"
                      />
                    </svg>
                  </button>
                </NavigationMenuItem>
                {/* avatar */}
                <NavigationMenuItem>
                  
                  <Avatar className="ml-8 flex items-center  justify-center">
                    <AvatarImage src="https://github.com/shadcn.png"></AvatarImage>
                    <AvatarFallback>CN</AvatarFallback> 
                    {/* this here ^ are the initials of the person which appear when the avatar does not load */}
                  </Avatar>
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
