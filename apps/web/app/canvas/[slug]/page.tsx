"use client";

import { nameAtom } from "@/app/store/atoms/authAtoms";
import SocketCanvas from "@/components/SocketCanvas";
import axios from "axios";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { slug: string } }) {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState<string>("");
  const currUserName = useAtomValue(nameAtom);

  useEffect(() => {
    const initializeRoom = async () => {
      try {
        const resolvedSlug = (await params).slug;
        setSlug(resolvedSlug);

        const response = await axios.get(
          `http://localhost:3001/api/canvas/${resolvedSlug}`
        );
        const data = response.data;

        if (data?.roomId) {
          setRoomId(data.roomId);
        } else {
          const token = localStorage.getItem("token");

          if (!token) {
            setError("Authentication token not found");
            return;
          }

          const createResponse = await axios.post(
            "http://localhost:3001/api/canvas",
            { name: resolvedSlug },
            {
              headers: {
                Authorization: token,
              },
            }
          );

          const created = createResponse.data;
          setRoomId(created.roomId);
        }
      } catch (e) {
        console.error("Room error:", e);
        setError("Failed to load or create room");
      } finally {
        setLoading(false);
      }
    };

    initializeRoom();
  }, [params]);

  if (loading) {
    return <div>Loading room...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!roomId) {
    return <div>Failed to load room.</div>;
  }

  if (!currUserName) {
    return <div>Fetching user's name</div>;
  }

  return (
    <SocketCanvas roomId={roomId} slug={slug} currUserName={currUserName} />
  );
}
