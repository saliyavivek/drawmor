"use client";

import { usernameAtom } from "@/app/store/atoms/authAtoms";
import Error from "@/components/Error";
import Loader from "@/components/Loader";
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
  const currUserName = useAtomValue(usernameAtom);
  const [loadingMessage, setLoadingMessage] = useState("Initializing...");
  const [value, setValue] = useState(0);

  useEffect(() => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const createRoom = async () => {
      try {
        setLoadingMessage("Initializing...");
        setValue(10);
        await delay(300);

        setLoadingMessage("Extracting canvas name...");
        setValue(30);
        await delay(300);

        const resolvedSlug = (await params).slug;
        setSlug(resolvedSlug);

        setLoadingMessage("Checking our database...");
        setValue(50);
        await delay(300);

        const createResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/canvas`,
          { name: resolvedSlug },
          {
            withCredentials: true,
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
        setValue(90);
        await delay(200);

        await delay(300);
        setValue(100);
      } catch (e) {
        setError("Something went wrong while creating canvas.");
      } finally {
        await delay(300);
        setLoading(false);
      }
    };

    createRoom();
  }, [params]);

  if (loading) {
    return <Loader message={loadingMessage} value={value} />;
  }

  if (!currUserName || !roomId) {
    return <Error currUserName={currUserName} error={error} />;
  }

  return (
    <SocketCanvas roomId={roomId} slug={slug} currUserName={currUserName} />
  );
}
