// src/components/layout/MobileNav.tsx
"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle, // <--- Import this
  SheetDescription, // <--- Import this (good practice)
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { useState } from "react";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="p-0 w-80 bg-card border-r border-border"
      >
        {/* ACCESSIBILITY FIX START */}
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">
          Mobile navigation sidebar
        </SheetDescription>
        {/* ACCESSIBILITY FIX END */}

        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}
