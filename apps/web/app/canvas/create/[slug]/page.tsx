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

        const token = localStorage.getItem("token");

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
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white">
        <p className="text-red-600 text-lg font-medium">
          {!currUserName
            ? "Please log in or create an account to proceed."
            : error}
        </p>
        <p className="text-xs sm:text-sm text-gray">
          <a href="/canvas" className="hover:underline">
            Back
          </a>
        </p>
      </div>
    );
  }

  return (
    <SocketCanvas roomId={roomId} slug={slug} currUserName={currUserName} />
  );
}
