"use client";

import { nameAtom, tokenAtom } from "@/app/store/atoms/authAtoms";
import Error from "@/components/Error";
import ProgressBar from "@/components/ProgressBar";
import SocketCanvas from "@/components/SocketCanvas";
import axios from "axios";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState(false);
  const currUserName = useAtomValue(nameAtom);
  const [loadingMessage, setLoadingMessage] = useState("Initializing...");
  const [value, setValue] = useState(0);
  const [roomAdmin, setRoomAdmin] = useState<string>("");
  const token = useAtomValue(tokenAtom);
  const [password, setPassword] = useState("");
  const [access, setAccess] = useState("public");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    if (!token) {
      setError("Please log in or create an account to proceed.");
      setLoading(false);
      return;
    }

    if (!currUserName) {
      setError("User information not found. Please log in again.");
      setLoading(false);
      return;
    }

    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const joinRoom = async () => {
      try {
        setError(null);
        setLoadingMessage("Initializing...");
        setValue(10);
        await delay(300);

        setLoadingMessage("Extracting canvas name...");
        setValue(30);
        await delay(300);

        const resolvedParams = (await params).slug;

        const resolvedSlug = resolvedParams[0];
        setSlug(resolvedSlug!);

        const resolvedAccess = resolvedParams[1];
        setAccess(resolvedAccess!);

        const resolvedPassword = resolvedParams[2];

        if (!resolvedSlug || resolvedSlug.trim() === "") {
          setError("Invalid canvas name provided.");
          return;
        }

        setLoadingMessage("Checking our database...");
        setValue(50);
        await delay(300);

        const joinResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/canvas/${encodeURIComponent(resolvedSlug.trim())}`,
          {
            password: resolvedPassword ? resolvedPassword.trim() : "",
            isPrivate: resolvedAccess === "private" ? true : false,
          },
          {
            headers: {
              Authorization: token,
            },
            validateStatus: () => true,
          }
        );

        // Handle specific error cases
        if (joinResponse.status === 403) {
          setError(
            `No canvas found with the name '${resolvedSlug}'. Please double-check the name and try again.`
          );
          return;
        }

        if (joinResponse.status === 400) {
          setError(
            "The password you've entered is incorrect. Please verify the password and try again."
          );
          return;
        }

        if (joinResponse.status >= 500) {
          setError("Server error occurred. Please try again in a few moments.");
          return;
        }

        if (!joinResponse.data || !joinResponse.data.roomId) {
          setError("Invalid response from server. Unable to join the canvas.");
          return;
        }

        setLoadingMessage("Joining canvas...");
        setValue(70);
        await delay(300);

        const joined = joinResponse.data;
        setRoomId(joined.roomId);
        setRoomAdmin(joined.admin || ""); // Ensure admin is always a string

        setLoadingMessage("Finalizing...");
        setValue(75);
        await delay(200);

        setValue(80);
        await delay(300);
        setValue(90);
      } catch (error) {
        console.error("Error joining canvas:", error);

        if (axios.isAxiosError(error)) {
          if (error.code === "NETWORK_ERROR" || !error.response) {
            setError(
              "Network error. Please check your connection and try again."
            );
          } else if (error.response?.status >= 500) {
            setError("Server error. Please try again later.");
          }
        } else {
          setError("An unexpected error occurred while joining the canvas.");
        }
      } finally {
        setLoading(false);
      }
    };

    joinRoom();
  }, [params, token, currUserName, isInitialized]);

  if (!isInitialized) {
    return <ProgressBar message="Loading..." value={5} />;
  }

  if (!currUserName || !token) {
    return (
      <Error backUrl="/signin" error={error || "Authentication required"} />
    );
  }

  if (error && !loading) {
    return <Error backUrl="/canvas" error={error} />;
  }

  if (loading) {
    return <ProgressBar message={loadingMessage} value={value} />;
  }

  if (!roomId) {
    return <Error backUrl="/canvas" error="Failed to join canvas room" />;
  }

  return (
    <SocketCanvas
      roomId={roomId}
      slug={slug}
      currUserName={currUserName}
      roomAdmin={roomAdmin}
      token={token}
      isPrivate={access === "private" ? true : false}
    />
  );
}
