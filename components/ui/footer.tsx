'use client'
import * as React from "react"

export default function Footer (){
    return (
        <>
            <div className="flex flex-row justify-center items-center gap-5 text-slate-700">
                <button className="hover:text-slate-900"><a href="/">Home</a></button>
                <button className="hover:text-slate-900">Log out</button>
                <button className="hover:text-slate-900">Terms of Service</button>
                <button className="hover:text-slate-900">Contact us</button>
                


            </div>
        </>
    )
}
   