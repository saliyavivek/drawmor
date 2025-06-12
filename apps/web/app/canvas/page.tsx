"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Users, ArrowRight, Loader2 } from "lucide-react";

export default function CanvasSelectionPage() {
  const [canvasSlug, setCanvasSlug] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCreateCanvas = () => {
    setIsCreating(true);

    if (!newSlug.trim()) return;

    if (newSlug.length < 3 || newSlug.length > 10) {
      setError(
        "Canvas name should be atleast 3 and atmost of 10 characters long."
      );
      setIsCreating(false);
      return;
    }

    try {
      router.push(`/canvas/create/${newSlug.trim()}`);
    } catch (error) {
      setError("Somthing went wrong. Please try again.");
    }
  };

  const handleJoinCanvas = async () => {
    setIsJoining(true);

    if (!canvasSlug.trim()) return;

    if (canvasSlug.length < 3 || canvasSlug.length > 10) {
      setError(
        "Canvas name should be atleast 3 and atmost of 10 characters long."
      );
      setIsJoining(false);
      return;
    }

    try {
      router.push(`/canvas/join/${canvasSlug.trim()}`);
    } catch (error) {
      setError("Somthing went wrong. Please try again.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, type: "join" | "create") => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (type === "join") {
        handleJoinCanvas();
      } else {
        handleCreateCanvas();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <img
              src="/logo_colored.png"
              alt="Drawmor Logo"
              className="h-24 w-auto rounded"
              width={20}
              height={20}
            />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start creating or join an existing canvas to collaborate with others
            in real-time.
          </p>
        </div>

        {/* Canvas Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Create New Canvas */}
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <CardHeader className="relative">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Create New Canvas</CardTitle>
              <CardDescription className="text-base">
                Start with a blank canvas and invite others to collaborate with
                you.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-slug" className="text-base font-medium">
                  Name your canvas
                </Label>
                <Input
                  id="new-slug"
                  placeholder="Choose a name for your canvas"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, "create")}
                  className="text-base py-6"
                  disabled={isCreating}
                />
                {error && (
                  <p className="text-sm text-muted-foreground">
                    Canvas name should be atleast 3 and atmost of 10 characters
                    long.
                  </p>
                )}
              </div>
              <Button
                onClick={handleCreateCanvas}
                className="w-full"
                size="lg"
                disabled={!newSlug.trim() || isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Create Canvas
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Join Existing Canvas */}
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent" />
            <CardHeader className="relative">
              <div className="h-12 w-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-secondary-foreground" />
              </div>
              <CardTitle className="text-2xl">Join Canvas</CardTitle>
              <CardDescription className="text-base">
                Enter canvas name to join an existing collaborative session.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-2">
                <Label htmlFor="canvas-slug" className="text-base font-medium">
                  Canvas name
                </Label>
                <Input
                  id="canvas-slug"
                  placeholder="Enter canvas name"
                  value={canvasSlug}
                  onChange={(e) => setCanvasSlug(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, "join")}
                  className="text-base py-6"
                  disabled={isJoining}
                />
                <p className="text-sm text-muted-foreground">
                  Ask the canvas creator for the canvas name to join.
                </p>
              </div>
              <Button
                type="submit"
                className="w-full mt-2"
                size="lg"
                disabled={!canvasSlug.trim() || isJoining}
                variant="secondary"
                onClick={handleJoinCanvas}
              >
                {isJoining ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Joining...
                  </>
                ) : (
                  <>
                    Join Canvas
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
