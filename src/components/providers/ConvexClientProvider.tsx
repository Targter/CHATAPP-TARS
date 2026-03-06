"use client";

import { ReactNode } from "react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { usePresence } from "@/hooks/usePresence";
import { UserSync } from "@/components/common/UserSync"; // <--- IMPORT THIS

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function PresenceManager({ children }: { children: ReactNode }) {
  usePresence();
  return <>{children}</>;
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        variables: {
          colorPrimary: "#9280FC",
          colorBackground: "#0F0F14",
          colorText: "#FFFFFF",
          colorInputBackground: "#1A1A23",
          colorInputText: "#FFFFFF",
        },
      }}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {/* Mount UserSync here so it runs on every page */}
        <UserSync />

        <PresenceManager>{children}</PresenceManager>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
