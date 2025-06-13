"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { loginAtom } from "@/app/store/atoms/authAtoms";
import { useRouter } from "next/navigation";

export function SessionSync() {
  const { data: session, status } = useSession();
  const login = useSetAtom(loginAtom);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session) {
      login(session);
    }
  }, [session, status]);

  return null;
}
