"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import AuthForm from "@/components/AuthForm";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (data: { username: string; password: string }) => {
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        username: data.username,
        password: data.password,
      });

      if (res?.ok) {
        toast("Logged in.");
        router.push("/");
      } else {
        toast("Invalid credentials.");
      }

      // if (responseData.token) {
      //   localStorage.setItem("token", responseData.token);
      //   login(responseData.token);
      // }
      // router.push("/canvas");
    } catch (error) {
      alert("Error while signing in.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm mode="signin" onSubmit={handleSignIn} isLoading={isLoading} />
  );
}
