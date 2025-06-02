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
import { Plus, Users, ArrowRight, Palette } from "lucide-react";

export default function CanvasSelectionPage() {
  const [canvasSlug, setCanvasSlug] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const router = useRouter();

  const handleCreateCanvas = async () => {
    setIsCreating(true);
    try {
      router.push(`/canvas/${newSlug.trim()}`);
    } catch (error) {
      console.error("Failed to create canvas:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinCanvas = async () => {
    if (!canvasSlug.trim()) return;

    setIsJoining(true);
    try {
      // Navigate to the existing canvas
      router.push(`/canvas/${canvasSlug.trim()}`);
    } catch (error) {
      console.error("Failed to join canvas:", error);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center">
              <Palette className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              DrawFlow
            </span>
          </h1>
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
              <div className="space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="h-2 w-2 bg-primary rounded-full mr-3" />
                  Unlimited canvas size
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="h-2 w-2 bg-primary rounded-full mr-3" />
                  Real-time collaboration
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="h-2 w-2 bg-primary rounded-full mr-3" />
                  Instant sharing
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="canvas-slug" className="text-base font-medium">
                  Name your canvas
                </Label>
                <Input
                  id="canvas-slug"
                  placeholder="Choose a name for your canvas (e.g., my-project)"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  className="text-base py-6"
                  disabled={isCreating}
                />
              </div>
              <Button
                onClick={handleCreateCanvas}
                className="w-full"
                size="lg"
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
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
                Enter a canvas name to join an existing collaborative session.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-2">
                <Label htmlFor="canvas-slug" className="text-base font-medium">
                  Canvas Name
                </Label>
                <Input
                  id="canvas-slug"
                  placeholder="Enter canvas name (e.g., my-project)"
                  value={canvasSlug}
                  onChange={(e) => setCanvasSlug(e.target.value)}
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
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
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
