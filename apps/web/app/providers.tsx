"use client";

import { SessionSync } from "@/components/SessionSync";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <SessionSync />
    </SessionProvider>
  );
}
