"use client";

import { useClerk } from "@clerk/nextjs";
import {
  Plus,
  Search,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Users,
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
// import { SettingsDialog } from "./SettingsDialog";
import { SettingsDialog } from "./SettingDialog";
import { CreateGroupDialog } from "@/components/chat/CreateGroupDialog";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const { signOut } = useClerk();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGroupOpen, setIsGroupOpen] = useState(false);

  const convexUser = useQuery(api.users.currentUser);

  return (
    <div className="h-full w-full flex flex-col bg-card/50 backdrop-blur-xl relative">
      <UserSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      <CreateGroupDialog
        isOpen={isGroupOpen}
        onClose={() => setIsGroupOpen(false)}
      />

      {/* Header - FIXED LAYOUT */}
      <div className="p-4 flex items-center justify-between border-b border-border/40 h-[73px] shrink-0">
        {!isCollapsed && (
          <div className="flex items-center gap-3 flex-1 overflow-hidden">
            <div className="h-8 w-8 bg-gradient-to-tr from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
              <span className="text-white font-bold font-heading">T</span>
            </div>
            <span className="font-heading font-semibold text-lg tracking-tight whitespace-nowrap">
              Tars AI
            </span>
          </div>
        )}

        {/* Inline Toggle Button instead of floating */}
        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className={cn(
              "hidden md:flex shrink-0 text-muted-foreground hover:text-foreground",
              isCollapsed && "w-full mx-auto",
            )}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-5 h-5" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
            )}
          </Button>
        )}
      </div>

      {/* Action / Search - FIXED SCALING */}
      <div className={cn("p-4 space-y-3 shrink-0", isCollapsed && "px-2")}>
        <div
          className={cn("flex gap-2", isCollapsed ? "flex-col" : "flex-row")}
        >
          <Button
            onClick={() => setIsSearchOpen(true)}
            className={cn(
              "flex-1 bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all",
              isCollapsed
                ? "h-12 rounded-xl px-0"
                : "justify-start px-4 border-1",
            )}
            title="New Chat"
          >
            <Plus
              className={cn(
                "shrink-0",
                isCollapsed ? "w-5 h-5" : "w-4 h-4 mr-2",
              )}
            />
            {!isCollapsed && "New Chat"}
          </Button>

          <Button
            onClick={() => setIsGroupOpen(true)}
            variant="outline"
            className={cn(
              "shrink-0 transition-all flex-1",
              isCollapsed ? "h-12 rounded-xl px-0" : "px-3",
            )}
            title="Create Group"
          >
            {/* <Users className="w-5 h-5 text-muted-foreground" /> */}
            <Users
              className={cn(
                "shrink-0",
                isCollapsed ? "w-5 h-5" : "w-4 h-4 mr-2",
              )}
            />
            {!isCollapsed && "New Group"}
          </Button>
        </div>

        {!isCollapsed && (
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Find people..."
              className="pl-9 bg-background/50 border-border/50 focus-visible:ring-primary/20 transition-all"
              onFocus={() => setIsSearchOpen(true)}
            />
          </div>
        )}
      </div>

      {/* Navigation / Conversation List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 overflow-x-hidden">
        {!isCollapsed && (
          <div className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider mb-1">
            Recent Messages
          </div>
        )}
        <ConversationList isCollapsed={isCollapsed} />
      </div>

      {/* Footer / User Profile */}
      <div className="p-3 bg-background/30 shrink-0 cursor-pointer">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full h-14  group",
                isCollapsed ? "px-0 justify-center" : "justify-start px-2",
              )}
            >
              <div className="flex items-center gap-3 w-full justify-center md:justify-start cursor-pointer ">
                <Avatar className="h-9 w-9  transition-transform group-hover:scale-105 shrink-0">
                  <AvatarImage src={convexUser?.image} />
                  <AvatarFallback>{convexUser?.name?.[0]}</AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <>
                    <div className="flex flex-col items-start text-left flex-1 min-w-0 cursor-pointer">
                      <span className="text-sm font-medium truncate w-full text-foreground group-hover:text-primary transition-colors">
                        {convexUser?.name || "User"}
                      </span>
                    </div>
                    <Settings className="w-4 h-4 text-muted-foreground opacity-90 shrink-0 cursor-pointer" />
                  </>
                )}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-60 mb-2 bg-background/95 backdrop-blur-sm"
            align={isCollapsed ? "center" : "start"}
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
