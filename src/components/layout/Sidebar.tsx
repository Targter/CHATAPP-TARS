"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import {
  Plus,
  Search,
  Settings,
  LogOut,
  MessageSquareDashed,
  Users,
  SearchIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { UserSearch } from "@/components/common/UserSearch";
import { ConversationList } from "@/components/layout/ConversationList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateGroupDialog } from "@/components/chat/CreateGroupDialog";
// import { CreateGroupDialog } from "../chat/createGroupDialog";
// import { CreateGroupDialog } from "../chat/createGroupDialog";
// import { CreateGroupDialog } from "../chat/createGroupDialog";
// import { CreateGroupDialog } from "../CreateGroupDialog";
// import mC

// import { SettingsDialog } from "./SettingsDialog"; // Import
import { SettingsDialog } from "./SettingDialog";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";

export function Sidebar() {
  const { signOut } = useClerk();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [isGroupOpen, setIsGroupOpen] = useState(false);
  // Use Convex user for the image (since it updates live with our new upload feature)
  const convexUser = useQuery(api.users.currentUser);

  return (
    <div className="h-full w-full flex flex-col bg-card/50 border-r border-border backdrop-blur-xl">
      <UserSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <CreateGroupDialog
        isOpen={isGroupOpen}
        onClose={() => setIsGroupOpen(false)}
      />
      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-border/40">
        <Link href="/">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8  rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="font-bold font-heading">T</span>
            </div>
            <span className="font-heading font-semibold text-lg tracking-tight">
              Tars AI
            </span>
          </div>
        </Link>
        {/* <div>search</div> */}
        <Button
          onClick={() => setIsSearchOpen(true)}
          className=""
          variant="outline"
        >
          {/* <Plus className="w-4 h-4 mr-2" /> New Chat */}
          <SearchIcon />
        </Button>
      </div>

      <div className="flex">
        <Button
          onClick={() => setIsSearchOpen(true)}
          className="flex-1 border-r-1 border-s-amber-700"
          // variant="outline"
        >
          <Plus className="w-4 h-4 mr-2" /> New Chat
        </Button>
        <Button
          onClick={() => setIsGroupOpen(true)}
          // variant="outline"

          size="icon"
          title="Create Group"
          className="w-[50%] "
        >
          <Users className="w-4 h-4" /> New Group
          {/* Import Users from lucide-react */}
        </Button>
      </div>
      {/* Navigation / Conversation List */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        <div className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider mb-1">
          Recent Messages
        </div>
        <ConversationList />
      </div>

      {/* Footer / User Profile (Redesigned) */}
      <div className="p-3 border-t border-border/40 bg-background/30">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start h-14 px-2 hover:bg-primary/10 group"
            >
              <div className="flex items-center gap-3 w-full">
                <Avatar className="h-9 w-9 border border-border/50 transition-transform group-hover:scale-105">
                  {/* Prefer Convex User image, fallback to Clerk or placeholder */}
                  <AvatarImage src={convexUser?.image} />
                  <AvatarFallback>{convexUser?.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-left flex-1 min-w-0">
                  <span className="text-sm font-medium truncate w-full text-foreground group-hover:text-primary transition-colors">
                    {convexUser?.name || "User"}
                  </span>
                  <span className="text-xs text-muted-foreground truncate w-full">
                    {convexUser?.email}
                  </span>
                </div>
                <Settings className="w-4 h-4 text-muted-foreground opacity-80" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-60 mb-2 backdrop-blur-md "
            align="start"
          >
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setIsSettingsOpen(true)}
              className="cursor-pointer"
            >
              <Settings className="w-4 h-4 mr-2" />
              Profile & Theme
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={() => signOut()}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
