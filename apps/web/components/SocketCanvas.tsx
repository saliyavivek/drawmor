"use client";

import { useEffect, useRef, useState } from "react";
import MainCanvas from "./MainCanvas";
import { SocketCanvasProps } from "@/types/types";
import { toast } from "sonner";

export default function SocketCanvas({
  roomId,
  slug,
  currUserName,
}: SocketCanvasProps) {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_URL}?token=${localStorage.getItem("token")}`
    );

    ws.onopen = () => {
      socketRef.current = ws;
      setIsConnected(true);
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId,
          },
        })
      );
    };

    ws.addEventListener("message", (ev) => {
      const message = JSON.parse(ev.data);

      if (message.type === "user_list") {
        const users = message.payload.users;
        setUsers(users);
      }

      if (message.type === "leave") {
        toast(`${message.payload.userLeft} left the room.`);
      }

      if (message.type === "join") {
        toast(
          `${message.payload.userJoined == currUserName ? "You" : message.payload.userJoined} joined the room.`
        );
      }
    });

    ws.onclose = () => {
      setIsConnected(false);
      socketRef.current = null;
    };

    ws.onerror = () => {
      setIsConnected(false);
      socketRef.current = null;
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
        socketRef.current = null;
      }
    };
  }, [roomId]);

  if (!isConnected || !socketRef.current) {
    return <div>Connecting to websocket server...</div>;
  }

  return (
    <div>
      <MainCanvas
        roomId={roomId}
        socket={socketRef.current}
        slug={slug}
        users={users}
      />
    </div>
  );
}
