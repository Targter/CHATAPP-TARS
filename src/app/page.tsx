"use client";

import Link from "next/link";
import {
  MessageSquare,
  Zap,
  Bot,
  ArrowRight,
  Terminal,
  Trash2,
  Shield,
  Users,
  Palette,
  Settings,
  Github,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useUser();

  // Reusable Auth Call-To-Action Component for consistent styling
  const AuthCTA = ({
    size = "default",
    className = "",
  }: {
    size?: "default" | "sm" | "lg";
    className?: string;
  }) => {
    if (!isLoaded)
      return (
        <Button size={size} className={className} disabled>
          Loading...
        </Button>
      );

    return isSignedIn ? (
      <Button asChild size={size} className={className}>
        <Link href="/chat">
          Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    ) : (
      <SignInButton mode="modal">
        <Button size={size} className={className}>
          Start Chatting <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </SignInButton>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/20">
      {/* Sticky Header with Glassmorphism */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border/40 bg-background/80 px-6 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Terminal className="h-4 w-4" />
          </div>
          <span className="font-bold tracking-tight text-foreground">Tars</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#features"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="#customization"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Customization
          </Link>
          <Link
            href="#stack"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Stack
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <AuthCTA size="sm" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center overflow-hidden px-6 py-24 sm:py-32">
          {/* Subtle background glow */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center bg-white dark:bg-black">
            <div className="absolute h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[100px]" />
          </div>

          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-secondary/50 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              v2.0 is live with Group Chats & Theming
            </div>

            <h1 className="mb-6 text-balance text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Developer-first chat, <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                reimagined.
              </span>
            </h1>

            <p className="mb-10 text-pretty text-lg text-muted-foreground sm:text-xl sm:leading-8">
              A professional-grade messaging platform built for scale. Featuring
              real-time sync, extensive customization, group creation, and a
              seamless interface.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <AuthCTA size="lg" className="w-full h-12 px-8 sm:w-auto" />
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full h-12 px-8 sm:w-auto group"
              >
                <Link
                  href="https://github.com/targter"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                  View Source
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section
          id="features"
          className="border-t border-border/40 bg-secondary/10 px-6 py-20"
        >
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Everything you need to connect
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Professional tools designed for a frictionless communication
                experience.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<Users className="h-5 w-5" />}
                title="Create & Manage Groups"
                description="Easily add users, create group chats, and manage permissions with our powerful group architecture."
              />
              <FeatureCard
                icon={<Palette className="h-5 w-5" />}
                title="Theme Customization"
                description="Fix your eyes on beautiful light and dark modes. Personalize accent colors to match your brand."
              />
              <FeatureCard
                icon={<Settings className="h-5 w-5" />}
                title="Advanced Navigation"
                description="Efficiently navigate through DMs, groups, and settings using our optimized sidebar navigation."
              />
              <FeatureCard
                icon={<Zap className="h-5 w-5" />}
                title="Real-time Synchronization"
                description="Powered by Convex. Messages, typing indicators, and read receipts sync instantly across all devices."
              />
              <FeatureCard
                icon={<Shield className="h-5 w-5" />}
                title="Enterprise-grade Auth"
                description="Secure authentication, user profiles, and session management built directly into the core with Clerk."
              />
              <FeatureCard
                icon={<Bot className="h-5 w-5" />}
                title="AI-Powered Suggestions"
                description="Smart reply assistance and content moderation to keep your chat environments clean and efficient."
              />
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section id="stack" className="border-t border-border/40 px-6 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-8 text-2xl font-bold tracking-tight text-foreground">
              Powered by modern web technologies
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <TechBadge name="Convex" description="Database & Real-time" />
              <TechBadge name="Clerk" description="Authentication" />
              <TechBadge name="Next.js 14" description="React Framework" />
              <TechBadge name="Tailwind CSS" description="Styling Engine" />
              <TechBadge name="TypeScript" description="Type Safety" />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-secondary/20 px-6 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2.5 text-sm font-medium text-foreground">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Terminal className="h-3 w-3" />
            </div>
            <span>Tars Messenger</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Designed & Built by{" "}
            <Link
              href="https://abhaybansal.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-4 transition-all hover:underline"
            >
              Abhay Bansal
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

// Subcomponents

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 transition-all hover:shadow-md hover:border-primary/20 dark:hover:bg-secondary/20">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        {icon}
      </div>
      <h3 className="mb-2 text-base font-semibold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function TechBadge({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-full border border-border/50 bg-card px-5 py-2.5 transition-all hover:scale-105 hover:border-border hover:shadow-sm">
      <span className="text-sm font-semibold text-foreground">{name}</span>
      <div className="h-3 w-[1px] bg-border/80"></div>
      <span className="text-sm text-muted-foreground">{description}</span>
    </div>
  );
}
