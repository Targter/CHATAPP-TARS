"use client";

import { ReactNode, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils"; // Make sure to import cn

export default function ChatLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  // NEW: State for collapsible sidebar
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return null;

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Desktop Sidebar with dynamic width */}
      <aside
        className={cn(
          "hidden md:flex flex-col h-full border-r border-border transition-all duration-300 ease-in-out relative",
          isCollapsed ? "w-[80px]" : "w-80",
        )}
      >
        <Sidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full flex flex-col relative min-w-0">
        <div className="md:hidden absolute top-4 left-4 z-50">
          <MobileNav />
        </div>
        {children}
      </main>
    </div>
  );
}
