import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import Link from "next/link";

export default function Home() {
  return (
    <>
      <NavigationMenu className=" p-4">
        <NavigationMenuList>
          <NavigationMenuItem className="px-3">
          <div className="bg-slate-400 w-[4rem] h-[0.46rem] rounded mb-[0.27rem]"></div>
          <div className="bg-slate-400 w-[4rem] h-[0.46rem] rounded mb-[0.27rem]"></div>
          <div className="bg-slate-400 w-[4rem] h-[0.46rem] rounded mb-[0.27rem]"></div>
          
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="#" legacyBehavior passHref>
              <NavigationMenuLink className="font-bold text-slate-400 text-5xl ml-3">
                EventHub
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
          <input 
            type="text" 
            placeholder="Search..."
            className="w-[45rem] ml-[7rem] px-4 py-2 border-[0.15rem] border-gray-300 rounded-3xl focus:outline-none focus:ring-0 focus:border-gray-300 shadow"
          />
          </NavigationMenuItem>
          <NavigationMenuItem>
          <div className="relative inline-block ml-4 w-10 h-10 mt-2">
      <div className="absolute top-0 left-0 w-[2rem] h-[2rem] border-[0.4rem] border-[#2E4F6F] rounded-full"></div>
      <div className="absolute mr-1 mb-[-0.1.5rem] bottom-0 right-0 w-5 h-2 bg-[#2E4F6F] transform rotate-45 origin-bottom-right"></div>
    </div>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
}
