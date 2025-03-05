import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"



export default function ThemeChanger() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

useEffect(() => {
    const root = document.documentElement;
    root.style.transition = "background-color 0.3s, color 0.3s";

    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);

    localStorage.setItem("theme", theme);

    if (theme === "dark") {
        document.body.classList.add("bg-slate-900", "text-sky-200", "text-slate-400");
        document.body.classList.remove("bg-white", "text-sky-800", "text-sky-800");
       
    } else {
        document.body.classList.add("bg-white", "text-sky-800", "text-sky-800");
        document.body.classList.remove("bg-slate-900", "text-sky-200", "text-slate-400");
        
    }
}, [theme]);

useEffect(() => {
    const body = document.body;
    body.style.transition = "background-color 0.3s, color 0.3s";
}, []);

    function setNotif() {
        if (theme === "dark") {
            toast("Light mode activated!");
        } else {
            toast("Dark mode activated!");
        }
    }

return (
    <>
    <Button
        onClick={() => {
            setTheme(theme === "light" ? "dark" : "light");
            setNotif();
        }}
        className={`p-2 rounded-full shadow-lg transition-colors duration-300 ${
            theme === "light"
                ? "bg-sky-500 hover:bg-sky-600 text-white"
                : "bg-sky-700 hover:bg-sky-800 text-white"
        }`}
    >
        {theme === "light" ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
    </Button>
    
  </>
);
}