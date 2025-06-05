"use client";

import { nameAtom } from "@/app/store/atoms/authAtoms";
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
  const currUserName = useAtomValue(nameAtom);
  const [loadingMessage, setLoadingMessage] = useState("Initializing...");
  const [value, setValue] = useState(0);

  useEffect(() => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const initializeRoom = async () => {
      try {
        setLoadingMessage("Initializing...");
        setValue(10);
        await delay(300);

        setLoadingMessage("Loading canvas...");
        setValue(30);
        await delay(300);

        const resolvedSlug = (await params).slug;
        setSlug(resolvedSlug);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/canvas/${resolvedSlug}`
        );
        const data = response.data;

        if (data?.roomId) {
          await delay(200); // fake processing
          setLoadingMessage("Joining canvas...");
          setValue(90);

          setRoomId(data.roomId);
        } else {
          setLoadingMessage("Creating new canvas...");
          setValue(40);
          await delay(300);

          setLoadingMessage("Creating new canvas...");
          setValue(45);
          const token = localStorage.getItem("token");

          if (!token) {
            setError("Authentication token not found.");
            return;
          }

          const createResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/canvas`,
            { name: resolvedSlug },
            {
              headers: {
                Authorization: token,
              },
            }
          );

          setLoadingMessage("Finalizing...");
          setValue(80);
          await delay(200);

          const created = createResponse.data;
          setRoomId(created.roomId);

          await delay(300);
          setValue(100);
        }
      } catch (e) {
        console.error("Something went wrong:", e);
        // setError(e.response.data.errors);
      } finally {
        await delay(300); // show 100% for a brief moment
        setLoading(false);
      }
    };

    initializeRoom();
  }, [params]);

  if (loading) {
    return <Loader message={loadingMessage} value={value} />;
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white">
        <p className="text-red-600 text-lg font-medium">Error: {error}</p>
      </div>
    );
  }

  if (!roomId) {
    return <Loader message="Fetching canvas id..." />;
  }

  if (!currUserName) {
    return <Loader message="Fetching user's name..." value={75} />;
  }

  return (
    <SocketCanvas roomId={roomId} slug={slug} currUserName={currUserName} />
  );
}
