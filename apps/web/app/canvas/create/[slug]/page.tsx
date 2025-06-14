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
  const currUserName = useAtomValue(nameAtom);
  const [loadingMessage, setLoadingMessage] = useState("Initializing...");
  const [value, setValue] = useState(0);
  const token: string | null = useAtomValue(tokenAtom);

  useEffect(() => {
    if (!token) {
      setError("Please log in or create an account to proceed.");
      return;
    }

    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const createRoom = async () => {
      try {
        setLoadingMessage("Initializing...");
        setValue(10);
        await delay(180000);

        setLoadingMessage("Extracting canvas name...");
        setValue(30);
        await delay(300);

        const resolvedSlug = (await params).slug;
        setSlug(resolvedSlug);

        if (!token) {
          setError("Authentication token not found.");
          return;
        }

        setLoadingMessage("Checking our database...");
        setValue(50);
        await delay(300);

        const createResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/canvas`,
          { name: resolvedSlug },
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

        if (!createResponse.data || !createResponse.data.roomId) {
          setError(
            "Something went wrong while setting up your canvas. Please try again shortly."
          );
          return;
        }

        setLoadingMessage("Creating new canvas...");
        setValue(70);
        await delay(300);

        const created = createResponse.data;
        setRoomId(created.roomId);

        setLoadingMessage("Finalizing...");
        setValue(80);
        await delay(200);

        await delay(300);
        setValue(90);
      } catch (e) {
        setError("Something went wrong while creating canvas.");
      } finally {
        await delay(300);
        setLoading(false);
      }
    };

    createRoom();
  }, [params, token]);

  if (!currUserName) {
    return <Error backUrl="/signin" error={error} />;
  }

  if (!roomId) {
    return <Error backUrl="/canvas" error={error} />;
  }

  if (loading) {
    return <ProgressBar message={loadingMessage} value={value} />;
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
