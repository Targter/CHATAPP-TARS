// src/app/page.tsx
"use client";

import { SignInButton, UserButton, useConvexAuth } from "convex/react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const storeUser = useMutation(api.users.store);
  const user = useQuery(api.users.currentUser);

  // Sync user to Convex DB upon login
  useEffect(() => {
    if (isAuthenticated) {
      storeUser();
    }
  }, [isAuthenticated, storeUser]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-primary font-heading text-xl">
          Tars AI Loading...
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-background text-foreground">
      {/* HEADER */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold font-heading text-primary tracking-tight">
          Tars
        </h1>
        {isAuthenticated && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.name}
            </span>
            <UserButton afterSignOutUrl="/" />
          </div>
        )}
      </div>

      {/* HERO SECTION */}
      <div className="text-center space-y-6 max-w-lg">
        {!isAuthenticated ? (
          <>
            <h1 className="text-5xl font-bold font-heading bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent pb-2">
              Connect Intelligently.
            </h1>
            <p className="text-muted-foreground text-lg">
              Experience the next generation of real-time communication. Secure,
              fast, and purely AI-driven design.
            </p>
            <div className="pt-4">
              <SignInButton mode="modal">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white font-semibold"
                >
                  Get Started
                </Button>
              </SignInButton>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
              <span className="text-3xl">👋</span>
            </div>
            <h2 className="text-2xl font-semibold">
              Welcome back, {user?.name}
            </h2>
            <p className="text-muted-foreground">Your workspace is ready.</p>
            <Button
              variant="outline"
              className="border-primary/50 text-primary hover:bg-primary/10"
            >
              Launch Dashboard (Coming Soon)
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
