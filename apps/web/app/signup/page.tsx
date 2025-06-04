"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import AuthForm from "@/components/AuthForm";
import axios from "axios";
import { useSetAtom } from "jotai";
import { loginAtom } from "../store/atoms/authAtoms";
import { toast } from "sonner";

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const login = useSetAtom(loginAtom);

  const handleSignUp = async (data: { username: string; password: string }) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3001/api/user/signup",
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
      toast("Signed up.");
    } catch (error) {
      alert("Error while signing up.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm mode="signup" onSubmit={handleSignUp} isLoading={isLoading} />
  );
}
