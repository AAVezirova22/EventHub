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
          <div className="bg-black w-9 h-[0.4rem] rounded mb-[0.2rem]"></div>
          <div className="bg-black w-9 h-[0.4rem] rounded mb-[0.2rem]"></div>
          <div className="bg-black w-9 h-[0.4rem] rounded mb-[0.2rem]"></div>
          
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="#" legacyBehavior passHref>
              <NavigationMenuLink className="font-bold text-5xl">
                EventHub
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
}
