"use client";

import type React from "react";

import { useEffect, useState } from "react";
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
import { useAtomValue } from "jotai";
import { tokenAtom } from "../store/atoms/authAtoms";
import Error from "@/components/Error";

export default function CanvasSelectionPage() {
  const [canvasSlug, setCanvasSlug] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  const token = useAtomValue(tokenAtom);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const validateCanvasName = (name: string): string | null => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return "Canvas name is required.";
    }

    if (trimmedName.length < 3) {
      return "Canvas name must be at least 3 characters long.";
    }

    if (trimmedName.length > 20) {
      return "Canvas name must be at most 10 characters long.";
    }

    // Check for valid characters (alphanumeric, hyphens, underscores)
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmedName)) {
      return "Canvas name can only contain letters, numbers, hyphens, and underscores.";
    }

    return null;
  };

  const handleCreateCanvas = () => {
    if (!token || !isInitialized) return;

    setIsCreating(true);

    const trimmedSlug = newSlug.trim();
    const validationError = validateCanvasName(trimmedSlug);

    if (validationError) {
      setError(validationError);
      setIsCreating(false);
      return;
    }

    try {
      router.push(`/canvas/create/${encodeURIComponent(trimmedSlug)}`);
    } catch (error) {
      console.error("Error navigating to create canvas:", error);
      setError("Something went wrong while navigating. Please try again.");
      setIsCreating(false);
    }
  };

  const handleJoinCanvas = () => {
    if (!token || !isInitialized) return;

    setIsJoining(true);

    const trimmedSlug = canvasSlug.trim();
    const validationError = validateCanvasName(trimmedSlug);

    if (validationError) {
      setError(validationError);
      setIsJoining(false);
      return;
    }

    try {
      router.push(`/canvas/join/${encodeURIComponent(trimmedSlug)}`);
    } catch (error) {
      console.error("Error navigating to join canvas:", error);
      setError("Something went wrong while navigating. Please try again.");
      setIsJoining(false);
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

  // Handle input changes with validation
  const handleNewSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewSlug(value);

    // Clear error if user starts typing
    if (error) {
      setError(null);
    }
  };

  const handleCanvasSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCanvasSlug(value);

    // Clear error if user starts typing
    if (error) {
      setError(null);
    }
  };

  // Show loading while waiting for initialization
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // Handle authentication
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Error
          backUrl="/signin"
          error="Please log in or create an account to proceed."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <img
              src="/logo_colored.png"
              alt="Drawmor Logo"
              className="h-24 w-auto border rounded shadow-sm"
              width={96}
              height={96}
            />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start creating or join an existing canvas to collaborate with others
            in real-time.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-3xl mx-auto mb-6">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-destructive text-center font-medium">
                {error}
              </p>
            </div>
          </div>
        )}

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
                  placeholder="my-awesome-canvas"
                  value={newSlug}
                  onChange={handleNewSlugChange}
                  onKeyDown={(e) => handleKeyPress(e, "create")}
                  className="text-base py-6"
                  disabled={isCreating}
                  maxLength={30}
                />
                <p className="text-sm text-muted-foreground">
                  3-10 characters, letters, numbers, hyphens, and underscores
                  only.
                </p>
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
            <CardContent className="relative space-y-4">
              <div className="space-y-2">
                <Label htmlFor="canvas-slug" className="text-base font-medium">
                  Canvas name
                </Label>
                <Input
                  id="canvas-slug"
                  placeholder="canvas-name-here"
                  value={canvasSlug}
                  onChange={handleCanvasSlugChange}
                  onKeyDown={(e) => handleKeyPress(e, "join")}
                  className="text-base py-6"
                  disabled={isJoining}
                  maxLength={20}
                />
                <p className="text-sm text-muted-foreground">
                  Ask the canvas creator for the exact canvas name to join.
                </p>
              </div>
              <Button
                onClick={handleJoinCanvas}
                className="w-full"
                size="lg"
                disabled={!canvasSlug.trim() || isJoining}
                variant="secondary"
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
