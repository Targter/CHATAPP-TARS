// src/app/page.tsx
"use client";

import { SignInButton, useUser } from "@clerk/nextjs"; // <--- FIXED IMPORT
import { useConvexAuth, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const storeUser = useMutation(api.users.store);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      storeUser();
      router.push("/chat");
    }
  }, [isAuthenticated, storeUser, router]);

  if (isLoading) return null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-background text-foreground relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="text-center space-y-8 max-w-lg z-10">
        <h1 className="text-6xl font-bold font-heading bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent">
          Tars
        </h1>
        <p className="text-primary font-medium tracking-widest text-sm uppercase">
          AI Communication System
        </p>
        <div className="pt-4">
          <SignInButton mode="modal">
            <Button
              size="lg"
              className="h-12 px-8 bg-primary hover:bg-primary/90 text-white font-semibold rounded-full"
            >
              Initialize Session
            </Button>
          </SignInButton>
        </div>
      </div>
    </main>
  );
}
