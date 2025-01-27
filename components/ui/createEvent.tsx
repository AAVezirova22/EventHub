'use client'
import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

  export default function createEvent(){
    return(
        <>
            <Dialog>
                  <DialogTrigger asChild>
                    <button className="bg-slate-400 hover:bg-slate-600 flex items-center justify-center mr-[3rem]  rounded h-8 w-[3.6rem]">
                        <div className="relative w-10 h-10 flex items-center justify-center">
                            <div className="absolute w-4 h-[0.3em] bg-white rounded"></div>
                            <div className="w-[0.3rem] h-4 absolute bg-white rounded"></div>
                        </div>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <div className="grid grid-cols-4 items-center gap-4 ">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input id="name" value="Pedro Duarte" className="col-span-3" />
                      </div>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input id="name" value="Pedro Duarte" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                          Username
                        </Label>
                        <Input id="username" value="@peduarte" className="col-span-3" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Save changes</Button>
                    </DialogFooter>
                  </DialogContent>
            </Dialog>
        </>
    )
  }


