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
  const [roomAdmin, setRoomAdmin] = useState<string>("");

  useEffect(() => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const joinRoom = async () => {
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

        const joinResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/canvas/${resolvedSlug}`,
          {
            withCredentials: true,
            validateStatus: () => true,
          }
        );

        if (joinResponse.status === 403) {
          setError(
            `No canvas found with the name '${resolvedSlug}'. Please double-check the name and try again.`
          );
          return;
        }

        if (!joinResponse.data || !joinResponse.data.roomId) {
          setError(
            "Unable to join the canvas right now. Please try again shortly."
          );
          return;
        }

        setLoadingMessage("Joining canvas...");
        setValue(70);
        await delay(300);

        const joined = joinResponse.data;
        setRoomId(joined.roomId);
        setRoomAdmin(joined.admin);

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

    joinRoom();
  }, [params]);

  if (loading) {
    return <Loader message={loadingMessage} value={value} />;
  }

  if (!currUserName || !roomId) {
    return <Error currUserName={currUserName} error={error} />;
  }

  return (
    <SocketCanvas
      roomId={roomId}
      slug={slug}
      currUserName={currUserName}
      roomAdmin={roomAdmin}
    />
  );
}
