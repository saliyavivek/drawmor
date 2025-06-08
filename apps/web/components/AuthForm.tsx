"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Lock, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthFormProps } from "@/types/types";

export default function AuthForm({
  mode,
  onSubmit,
  isLoading = false,
  title,
  description,
  submitButtonText,
  linkText,
  linkHref,
}: AuthFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Default values based on mode
  const defaultTitle = mode === "signin" ? "Sign in" : "Create an account";
  const defaultDescription =
    mode === "signin"
      ? "Enter your credentials to access your account"
      : "Enter your details to create your account";
  const defaultSubmitText = mode === "signin" ? "Sign in" : "Create account";
  const defaultLinkText =
    mode === "signin"
      ? "Don't have an account? Sign up"
      : "Already have an account? Sign in";
  const defaultLinkHref = mode === "signin" ? "/signup" : "/signin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await onSubmit({
        username,
        password,
      });
    } catch (error) {
      // Error handling is done by the parent component
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {title || defaultTitle}
          </CardTitle>
          <CardDescription className="text-center">
            {description || defaultDescription}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  placeholder={
                    mode === "signin"
                      ? "Enter your username"
                      : "Choose a username"
                  }
                  className="pl-10"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={"password"}
                  placeholder={
                    mode === "signin"
                      ? "Enter your password"
                      : "Create a password"
                  }
                  className="pl-10"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 mt-4">
            {mode === "signin" && (
              <Button
                type="button"
                onClick={() => {
                  setUsername("johndoe");
                  setPassword("qodQ2kcjaqS@pa");
                }}
                className="w-full"
                disabled={isLoading}
              >
                Get Credentials
              </Button>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "signin" ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                submitButtonText || defaultSubmitText
              )}
            </Button>
            <div className="text-center text-sm">
              <Link
                href={linkHref || defaultLinkHref}
                className="underline-offset-4 hover:text-primary"
              >
                {linkText || defaultLinkText}
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
