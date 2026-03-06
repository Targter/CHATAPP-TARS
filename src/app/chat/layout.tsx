// src/app/chat/layout.tsx
"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav"; // Import
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ChatLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return null;

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-80 flex-col h-full border-r border-border">
        <Sidebar />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full flex flex-col relative min-w-0">
        {/* Mobile Header (Visible only on mobile) */}
        {/* We put this absolute or inside the pages, but for global structure: */}
        <div className="md:hidden absolute top-4 left-4 z-50">
          <MobileNav />
        </div>

        {children}
      </main>
    </div>
  );
}
