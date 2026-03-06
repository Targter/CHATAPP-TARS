// src/components/layout/Sidebar.tsx
"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { PlusCircle, Search, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Sidebar() {
  const { user } = useUser();

  return (
    <div className="h-full w-full flex flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold font-heading">T</span>
          </div>
          <span className="font-heading font-semibold text-lg tracking-tight">
            Tars AI
          </span>
        </div>
        {/* Mobile: This would be the close button, handled by parent in mobile view */}
      </div>

      {/* Action / Search */}
      <div className="p-4 space-y-4">
        <Button className="w-full justify-start gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 shadow-none">
          <PlusCircle className="w-4 h-4" />
          New Chat
        </Button>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-9 bg-background/50 border-border focus-visible:ring-primary/20"
          />
        </div>
      </div>

      {/* Navigation / Conversation List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground/50 uppercase tracking-wider">
          Conversations
        </div>

        {/* Placeholder for list */}
        <div className="px-2 py-8 text-center text-sm text-muted-foreground">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-20" />
          <p>No conversations yet</p>
        </div>
      </div>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-border bg-background/30">
        <div className="flex items-center gap-3">
          <UserButton afterSignOutUrl="/" />
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium truncate text-foreground">
              {user?.fullName}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {user?.primaryEmailAddress?.emailAddress}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
