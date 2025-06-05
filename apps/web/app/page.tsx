"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAtomValue, useSetAtom } from "jotai";
import { CircleIcon, Share2Icon, UsersIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { logoutAtom, userAtom } from "./store/atoms/authAtoms";
import { toast } from "sonner";

function Home() {
  const router = useRouter();
  const isLoggedIn = useAtomValue(userAtom);
  const link = isLoggedIn ? "/canvas" : "/signin";
  const logout = useSetAtom(logoutAtom);

  const handleLogout = () => {
    logout(); // Clear the token
    toast("Logged out.");
  };

  return (
    <div className="min-h-screen bg-background px-15">
      {/* Navigation */}
      <nav className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/logo_colored.png"
              alt="Drawmor Logo"
              className="h-8 w-auto"
              width={20}
              height={20}
            />
            <span className="font-semibold text-xl">Drawmor</span>
          </div>
          <div className="flex gap-4">
            {isLoggedIn ? (
              <>
                <Button
                  onClick={() => {
                    router.push("/canvas");
                  }}
                >
                  Get Started
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => router.push("/signin")}
                >
                  Sign in
                </Button>
                <Button onClick={() => router.push("/signup")}>Sign up</Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Collaborate and Create
          <span className="text-primary block">
            Beautiful Drawings Together
          </span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-8">
          Experience the joy of real-time collaborative drawing. Create, share,
          and bring your ideas to life with Drawmor&apos;s intuitive canvas.
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => {
              router.push(link);
            }}
          >
            Start Drawing Now
          </Button>
          <Button size="lg" variant="outline">
            Watch Demo
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6">
            <Share2Icon className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">
              Real-time Collaboration
            </h3>
            <p className="text-muted-foreground">
              Draw together in real-time with your team. See changes instantly
              as they happen.
            </p>
          </Card>
          <Card className="p-6">
            <UsersIcon className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Easy Sharing</h3>
            <p className="text-muted-foreground">
              Share your work with a simple link. No accounts required for
              viewers.
            </p>
          </Card>
          <Card className="p-6">
            <CircleIcon className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Intuitive Tools</h3>
            <p className="text-muted-foreground">
              Simple yet powerful drawing tools that feel natural and
              responsive.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="bg-primary/5 rounded-2xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Drawing?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of teams who are already creating amazing drawings
            together with Drawmor.
          </p>
          <Button
            size="lg"
            className="min-w-[200px]"
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
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img
                src="/logo_colored.png"
                alt="Drawmor Logo"
                className="h-6 w-auto"
              />
              <span className="text-sm text-muted-foreground">
                © 2025 Drawmor. All rights reserved.
              </span>
            </div>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
