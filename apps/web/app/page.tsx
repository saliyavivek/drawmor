"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAtomValue, useSetAtom } from "jotai";
import { CircleIcon, Share2Icon, UsersIcon, Menu, Github } from "lucide-react";
import { useRouter } from "next/navigation";
import { logoutAtom, userAtom } from "./store/atoms/authAtoms";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/ModeToggle";

function Home() {
  const router = useRouter();
  const isLoggedIn = useAtomValue(userAtom);
  const link = isLoggedIn ? "/canvas" : "/signin";
  const logout = useSetAtom(logoutAtom);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout(); // Clear the token
    toast("Logged out.");
  };

  const NavigationButtons = () => (
    <>
      {isLoggedIn ? (
        <>
          <Button
            onClick={() => {
              router.push("/canvas");
              setIsMobileMenuOpen(false);
            }}
            className="w-full sm:w-auto"
          >
            Get Started
          </Button>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full sm:w-auto"
          >
            Log out
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="outline"
            onClick={() => {
              router.push("/signin");
              setIsMobileMenuOpen(false);
            }}
            className="w-full sm:w-auto"
          >
            Sign in
          </Button>
          <Button
            onClick={() => {
              router.push("/signup");
              setIsMobileMenuOpen(false);
            }}
            className="w-full sm:w-auto"
          >
            Sign up
          </Button>
        </>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/logo_colored.png"
              alt="Drawmor Logo"
              className="h-6 w-6 sm:h-8 sm:w-8 rounded"
              width={32}
              height={32}
            />
            <span className="font-semibold text-lg sm:text-xl">Drawmor</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex gap-3 md:gap-4">
            <NavigationButtons />
            <ModeToggle />
          </div>

          {/* Mobile Navigation */}
          <div className="sm:hidden p-2">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Menu className="cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="m-1">
                {isLoggedIn && (
                  <>
                    <DropdownMenuLabel>{isLoggedIn.username}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                  </>
                )}
                {isLoggedIn ? (
                  <>
                    <DropdownMenuItem>
                      <p
                        onClick={() => {
                          router.push("/canvas");
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full"
                      >
                        Get Started
                      </p>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <p onClick={handleLogout} className="w-full sm:w-auto">
                        Log out
                      </p>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem>
                      <p
                        className="w-full"
                        onClick={() => {
                          router.push("/signin");
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Sign in
                      </p>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <p
                        className="w-full"
                        onClick={() => {
                          router.push("/signup");
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Sign up
                      </p>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16 md:py-24 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
          Collaborate and Create
          <span className="text-primary block mt-2">
            Beautiful Drawings Together
          </span>
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
          Experience the joy of real-time collaborative drawing. Create, share,
          and bring your ideas to life with Drawmor&apos;s intuitive canvas.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
          <Button
            size="lg"
            onClick={() => {
              router.push(link);
            }}
            className="w-full sm:w-auto min-w-[180px]"
          >
            Start Drawing Now
          </Button>
          {isLoggedIn && (
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto min-w-[140px]"
              onClick={handleLogout}
            >
              Log out
            </Button>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <Card className="p-4 sm:p-6 text-center md:text-left">
            <Share2Icon className="h-10 w-10 sm:h-12 sm:w-12 mb-3 sm:mb-4 text-primary mx-auto md:mx-0" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              Real-time Collaboration
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base">
              Draw together in real-time with your team. See changes instantly
              as they happen.
            </p>
          </Card>
          <Card className="p-4 sm:p-6 text-center md:text-left">
            <UsersIcon className="h-10 w-10 sm:h-12 sm:w-12 mb-3 sm:mb-4 text-primary mx-auto md:mx-0" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              Easy Sharing
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base">
              Share your work with a simple link.
            </p>
          </Card>
          <Card className="p-4 sm:p-6 text-center md:text-left">
            <CircleIcon className="h-10 w-10 sm:h-12 sm:w-12 mb-3 sm:mb-4 text-primary mx-auto md:mx-0" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              Intuitive Tools
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base">
              Simple yet powerful drawing tools that feel natural and
              responsive.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
        <div className="bg-primary/5 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Ready to Start Drawing?
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Join thousands of teams who are already creating amazing drawings
            together with Drawmor.
          </p>
          <Button
            size="lg"
            className="w-full sm:w-auto min-w-[200px]"
            onClick={() => {
              isLoggedIn ? router.push("/canvas") : router.push("/signin");
            }}
          >
            Get Started for Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-2">
              <div className="flex items-center gap-2">
                <img
                  src="/logo_colored.png"
                  alt="Drawmor Logo"
                  className="h-5 w-5 sm:h-6 sm:w-6"
                />
                <span className="text-xs sm:text-sm text-muted-foreground">
                  © 2025 Drawmor. All rights reserved.
                </span>
              </div>
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              <a
                href="https://github.com/saliyavivek/drawmor"
                className="flex gap-2 items-center hover:text-black dark:hover:text-white"
              >
                <span className="font-medium">Source Code</span>
                <Github className="h-5 w-auto" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
