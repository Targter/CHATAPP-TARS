// src/app/page.tsx
"use client";

// import { SignInButton, useConvexAuth } from "convex/react";
import { SignInButton, useUser } from "@clerk/nextjs"; // <--- FIXED IMPORT
import { useConvexAuth, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // Changed from 'next/router'

export default function Home() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const storeUser = useMutation(api.users.store);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      // Sync user and redirect
      storeUser();
      router.push("/chat");
    }
  }, [isAuthenticated, storeUser, router]);

  if (isLoading) return null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-background text-foreground relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="text-center space-y-8 max-w-lg z-10">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold font-heading bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent">
            Tars
          </h1>
          <p className="text-primary font-medium tracking-widest text-sm uppercase">
            AI Communication System
          </p>
        </div>

        <p className="text-muted-foreground text-lg leading-relaxed">
          A secure, high-performance environment for real-time collaboration.
          Authentication required for access.
        </p>

        <div className="pt-4">
          <SignInButton mode="modal">
            <Button
              size="lg"
              className="h-12 px-8 bg-primary hover:bg-primary/90 text-black font-semibold rounded-full shadow-[0_0_20px_-5px_rgba(146,128,252,0.5)] transition-all hover:scale-105"
            >
              Initialize Session
            </Button>
          </SignInButton>
        </div>
      </div>
    </main>
  );
}
