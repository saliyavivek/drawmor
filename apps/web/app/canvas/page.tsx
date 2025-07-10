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
import { Plus, Users, ArrowRight, Loader2, Lock, Globe } from "lucide-react";
import { useAtomValue } from "jotai";
import { tokenAtom } from "../store/atoms/authAtoms";
import Error from "@/components/Error";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

type SuggestedItems = {
  name: string;
  isPrivate: boolean;
};

export default function CanvasSelectionPage() {
  const [canvasSlug, setCanvasSlug] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState("");
  const [searching, setSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestedItems[]>([]);
  const [skipFetchOnNextUpdate, setSkipFetchOnNextUpdate] = useState(false);
  const [isSearchedRoomPrivate, setIsSearchedRoomPrivate] = useState(false);
  const [joinRoomPassword, setJoinRoomPassword] = useState("");

  const router = useRouter();

  const token = useAtomValue(tokenAtom);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (canvasSlug === "") {
      setSearching(false);
      return;
    }

    setSearching(true);

    if (skipFetchOnNextUpdate) {
      setSkipFetchOnNextUpdate(false); // reset flag
      setSearching(false);
    } else {
      const getData = setTimeout(async () => {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/canvas/search/suggestions?query=${canvasSlug}`,
          {
            headers: {
              Authorization: token,
            },
            validateStatus: () => true,
          }
        );
        const data = response.data;
        // console.log(data);
        setSuggestions(data);

        setSearching(false);
      }, 300);

      return () => clearTimeout(getData);
    }
  }, [canvasSlug]);

  const handleSelectSuggestion = (item: SuggestedItems) => {
    setCanvasSlug(item.name);
    setIsSearchedRoomPrivate(item.isPrivate);

    setSuggestions([]);
    setSkipFetchOnNextUpdate(true);
  };

  const validateCanvasName = (name: string): string | null => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return "Canvas name is required.";
    }

    if (trimmedName.length < 3) {
      return "Canvas name must be at least 3 characters long.";
    }

    if (trimmedName.length > 20) {
      return "Canvas name must be at most 20 characters long.";
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
      router.push(
        `/canvas/create/${encodeURIComponent(trimmedSlug)}/${isPrivate ? "private" : "public"}/${password}`
      );
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
      router.push(
        `/canvas/join/${encodeURIComponent(trimmedSlug)}/${isSearchedRoomPrivate ? "private" : "public"}/${joinRoomPassword}`
      );
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

  function generateCanvasName() {
    const randomName = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      separator: "-",
      length: 2,
    });
    setNewSlug(randomName);
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
                <div className="relative flex w-full">
                  <Input
                    id="new-slug"
                    placeholder="my-awesome-canvas"
                    value={newSlug}
                    onChange={handleNewSlugChange}
                    onKeyDown={(e) => handleKeyPress(e, "create")}
                    className="text-base py-6"
                    disabled={isCreating}
                    maxLength={10}
                  />
                  <Button
                    onClick={generateCanvasName}
                    size={"sm"}
                    variant={"outline"}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    Generate
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  3-20 characters, letters, numbers, hyphens, and underscores
                  only.
                </p>
                <p className="flex items-center gap-1">
                  <Checkbox
                    checked={isPrivate}
                    onCheckedChange={(checked) => {
                      setIsPrivate(checked === true);
                    }}
                  />
                  <span className="text-sm text-muted-foreground">
                    Make room private (password protected)
                  </span>
                </p>
                {isPrivate && (
                  <Input
                    id="room-password"
                    placeholder="my-secret-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => handleKeyPress(e, "create")}
                    className="text-base py-6"
                    disabled={isCreating}
                  />
                )}
              </div>
              <Button
                onClick={handleCreateCanvas}
                className="w-full"
                size="lg"
                disabled={
                  !newSlug.trim() ||
                  isCreating ||
                  (isPrivate && !password.trim())
                }
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
                  Search canvas name
                </Label>
                <div className="relative flex w-full">
                  <Input
                    id="canvas-slug"
                    placeholder="canvas-name-here"
                    value={canvasSlug}
                    onChange={handleCanvasSlugChange}
                    onKeyDown={(e) => handleKeyPress(e, "join")}
                    className="text-base py-6 pr-10"
                    disabled={isJoining}
                    maxLength={10}
                  />
                  {searching && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />
                  )}
                  {suggestions.length > 0 && (
                    <div className="absolute top-full mt-1 w-full max-h-30 overflow-auto rounded-md border shadow-md">
                      {suggestions.map((item, index) => (
                        <div
                          key={index}
                          className="px-3 py-2 hover:bg-muted cursor-pointer text-sm flex justify-between items-center"
                          onClick={() => handleSelectSuggestion(item)}
                        >
                          <span>{item.name}</span>
                          <span>
                            {item.isPrivate ? (
                              <Lock className="h-4 w-4" />
                            ) : (
                              <Globe className="h-4 w-4" />
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {isSearchedRoomPrivate && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      This canvas is password-protected. Please enter the
                      password to proceed.
                    </p>
                    <Input
                      placeholder="room-password"
                      value={joinRoomPassword}
                      onChange={(e) => setJoinRoomPassword(e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e, "join")}
                      className="text-base py-6"
                      disabled={isJoining}
                    />
                  </div>
                )}
              </div>
              {suggestions.length <= 0 && (
                <Button
                  onClick={handleJoinCanvas}
                  className="w-full"
                  size="lg"
                  disabled={
                    !canvasSlug.trim() ||
                    isJoining ||
                    (isSearchedRoomPrivate && !joinRoomPassword.trim())
                  }
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
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
