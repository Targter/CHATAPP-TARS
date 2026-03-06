// src/components/chat/MessageInput.tsx
"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Check if you have textarea, if not: npx shadcn-ui@latest add textarea
import { Send, Paperclip, Smile } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
// import { useRef } from "react"; // Ensure imported
import { Id } from "../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  conversationId: Id<"conversations">;
}

export function MessageInput({ conversationId }: MessageInputProps) {
  const [content, setContent] = useState("");
  const sendMessage = useMutation(api.messages.send);

  const sendTyping = useMutation(api.typing.kick); // NEW
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    if (!content.trim()) return;

    // Optimistic UI updates could go here, but Convex is fast enough
    try {
      await sendMessage({ conversationId, content });
      setContent("");
      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      console.error("Failed to send", error);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  const lastTypingRef = useRef(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);

    // Send typing notification at most every 1 second
    const now = Date.now();
    if (now - lastTypingRef.current > 1000) {
      sendTyping({ conversationId });
      lastTypingRef.current = now;
    }
  };

  return (
    // <div className="p-4 border-t border-border bg-card/30">
    //   <div className="flex items-end gap-2 bg-secondary/20 p-2 rounded-xl border border-border/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
    //     <Button
    //       variant="ghost"
    //       size="icon"
    //       className="text-muted-foreground hover:text-primary h-8 w-8 mb-1"
    //     >
    //       <Paperclip className="w-4 h-4" />
    //     </Button>
    //     <Textarea
    //       ref={textareaRef}
    //       value={content}
    //       onChange={handleInputChange} // UPDATED
    //       onKeyDown={handleKeyDown}
    //       placeholder="Type a message..."
    //       // ...
    //       className="min-h-[40px] max-h-[160px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-2 py-2 text-sm"
    //       rows={1}
    //     />

    //     <div className="flex gap-1 mb-1">
    //       <Button
    //         variant="ghost"
    //         size="icon"
    //         className="text-muted-foreground hover:text-primary h-8 w-8"
    //       >
    //         <Smile className="w-4 h-4" />
    //       </Button>
    //       <Button
    //         onClick={handleSend}
    //         disabled={!content.trim()}
    //         size="icon"
    //         className="bg-primary hover:bg-primary/90 text-white h-8 w-8 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    //       >
    //         <Send className="w-4 h-4" />
    //       </Button>
    //     </div>
    //   </div>
    //   <div className="text-xs text-center text-muted-foreground mt-2 opacity-50">
    //     AI-assisted suggestions enabled
    //   </div>
    // </div>

    <div className="p-4 pt-2 bg-transparent">
      <div className="relative flex items-end gap-2 bg-card/80 backdrop-blur-lg p-2 rounded-2xl border border-border/50 shadow-sm focus-within:shadow-md focus-within:ring-1 focus-within:ring-primary/30 transition-all">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-primary h-9 w-9 mb-0.5 rounded-xl shrink-0"
        >
          <Paperclip className="w-5 h-5" />
        </Button>

        <Textarea
          ref={textareaRef}
          value={content}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Message Tars AI..."
          className="min-h-[40px] max-h-[160px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-2 py-2.5 text-sm w-full placeholder:text-muted-foreground/60"
          rows={1}
        />

        <div className="flex gap-1 mb-0.5 shrink-0">
          <Button
            onClick={handleSend}
            disabled={!content.trim()}
            size="icon"
            className={cn(
              "h-9 w-9 rounded-xl transition-all",
              content.trim()
                ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:scale-105"
                : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed",
            )}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="text-[10px] text-center text-muted-foreground mt-2 opacity-40">
        Press Enter to send, Shift + Enter for new line
      </div>
    </div>
  );
}
