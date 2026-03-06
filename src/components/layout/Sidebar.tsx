// src/components/layout/Sidebar.tsx
"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { PlusCircle, Search } from "lucide-react"; // Removed MessageSquare
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { UserSearch } from "@/components/common/UserSearch";
import { ConversationList } from "@/components/layout/ConversationList"; // Import

export function Sidebar() {
  const { user } = useUser();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="h-full w-full flex flex-col bg-card border-r border-border">
      <UserSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

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
      </div>

      {/* Action / Search */}
      <div className="p-4 space-y-4">
        <Button
          onClick={() => setIsSearchOpen(true)}
          className="w-full justify-start gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 shadow-none"
        >
          <PlusCircle className="w-4 h-4" />
          New Chat
        </Button>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-9 bg-background/50 border-border focus-visible:ring-primary/20"
            onFocus={() => setIsSearchOpen(true)}
          />
        </div>
      </div>

      {/* Navigation / Conversation List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground/50 uppercase tracking-wider mb-2">
          Conversations
        </div>

        {/* Real List */}
        <ConversationList />
      </div>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-border bg-background/30">
        <div className="flex items-center gap-3">
          <UserButton />
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
