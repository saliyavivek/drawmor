"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import AuthForm from "@/components/AuthForm";
import axios from "axios";
import { loginAtom } from "../store/atoms/authAtoms";
import { useSetAtom } from "jotai";
import { toast } from "sonner";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const login = useSetAtom(loginAtom);

  const handleSignIn = async (data: { username: string; password: string }) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/signin`,
        {
          username: data.username,
          password: data.password,
        }
      );
      const responseData = response.data;

      if (responseData.token) {
        localStorage.setItem("token", responseData.token);
        login(responseData.token);
      }
      router.push("/canvas");
      toast("Logged in.");
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
