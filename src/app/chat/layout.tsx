// src/app/chat/layout.tsx
"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ChatLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  // Protect the route
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar - Hidden on mobile, visible on md+ */}
      <aside className="hidden md:flex w-80 flex-col h-full">
        <Sidebar />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full flex flex-col relative min-w-0">
        {children}
      </main>
    </div>
  );
}
