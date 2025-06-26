"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAtomValue, useSetAtom } from "jotai";
import { Users, PenTool, MessageSquare, Menu, Github } from "lucide-react";
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

  const features = [
    {
      icon: Users,
      title: "Real-time Collaboration",
      description:
        "Work together seamlessly with your team. See cursors, edits, and changes as they happen.",
    },
    {
      icon: PenTool,
      title: "Powerful Drawing Tools",
      description:
        "Create with rectangles, circles, arrows, and freehand drawing. Everything you need to visualize ideas.",
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description:
        "Discuss ideas without leaving the canvas. Built-in chat keeps conversations contextual.",
    },
  ];

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
                <DropdownMenuItem>
                  <div className="flex items-center w-full justify-between">
                    <span className="text-sm">Theme</span>
                    <span>
                      <ModeToggle />
                    </span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16 md:py-24 text-center">
        <div className="inline-flex items-center px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-600 mb-8">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
          <span className="font-semibold">With real-time chat feature</span>
        </div>
        <h1 className="text-5xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
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
      <section className="py-24 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to collaborate
            </h2>
            <p className="text-lg max-w-2xl mx-auto">
              Powerful features designed for modern teams who need to think,
              draw, and create together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 border  rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl font-semibold">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
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
