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
  const token: string | null = useAtomValue(tokenAtom);

  // Small delay to allow atoms to be initialized
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

    const createRoom = async () => {
      try {
        setError(null);
        setLoadingMessage("Initializing...");
        setValue(10);
        await delay(300);

        setLoadingMessage("Extracting canvas name...");
        setValue(30);
        await delay(300);

        const resolvedSlug = (await params).slug;
        setSlug(resolvedSlug);

        if (!resolvedSlug || resolvedSlug.trim() === "") {
          setError("Invalid canvas name provided.");
          return;
        }

        setLoadingMessage("Checking our database...");
        setValue(50);
        await delay(300);

        const createResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/canvas`,
          { name: resolvedSlug.trim() },
          {
            headers: {
              Authorization: token,
            },
            validateStatus: () => true,
          }
        );

        if (createResponse.status === 403) {
          setError(
            "That canvas name is already in use. Try choosing a unique one."
          );
          return;
        }

        if (createResponse.status >= 500) {
          setError("Server error occurred. Please try again in a few moments.");
          return;
        }

        setLoadingMessage("Creating new canvas...");
        setValue(70);
        await delay(300);

        const created = createResponse.data;
        setRoomId(created.roomId);

        setLoadingMessage("Finalizing...");
        setValue(75);
        await delay(200);

        setValue(80);
        await delay(300);
        setValue(90);
      } catch (error) {
        console.error("Error creating canvas:", error);

        // Handle different types of errors
        if (axios.isAxiosError(error)) {
          if (error.code === "NETWORK_ERROR" || !error.response) {
            setError(
              "Network error. Please check your connection and try again."
            );
          } else if (error.response?.status >= 500) {
            setError("Server error. Please try again later.");
          }
        } else {
          setError("An unexpected error occurred while creating the canvas.");
        }
      } finally {
        setLoading(false);
      }
    };

    createRoom();
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
    return <Error backUrl="/canvas" error="Failed to create canvas room" />;
  }

  return (
    <SocketCanvas
      roomId={roomId}
      slug={slug}
      currUserName={currUserName}
      token={token}
    />
  );
}
