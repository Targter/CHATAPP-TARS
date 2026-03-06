// src/app/chat/page.tsx
import { Bot } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
      <div className="bg-primary/10 p-6 rounded-full mb-6 ring-1 ring-primary/20">
        <Bot className="w-12 h-12 text-primary" />
      </div>
      <h2 className="text-2xl font-bold font-heading mb-2">
        Welcome to Tars AI
      </h2>
      <p className="text-muted-foreground max-w-md">
        Select a conversation from the sidebar or start a new one to begin
        chatting in real-time.
      </p>
    </div>
  );
}
