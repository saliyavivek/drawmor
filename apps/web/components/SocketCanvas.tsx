"use client";

import { useEffect, useRef, useState } from "react";
import MainCanvas from "./MainCanvas";
import { SocketCanvasProps } from "@/types/types";

export default function SocketCanvas({
  roomId,
  slug,
  currUserName,
}: SocketCanvasProps) {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const ws = new WebSocket(
      `ws://localhost:8080?token=${localStorage.getItem("token")}`
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

      // if (message.type === "draw_shape") {
      //   console.log(message);
      // }

      if (message.type === "user_list") {
        const users = message.payload.users;
        setUserCount(users.count);
      }

      // if (message.type === "leave") {
      //   toast(`${message.payload.userLeft} left the room.`);
      // }

      // if (message.type === "join") {
      //   console.log(message.payload.userJoined + " " + currUserName);
      //   toast(
      //     `${message.payload.userJoined == currUserName ? "You" : message.payload.userJoined} joined the room.`
      //   );
      // }
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
        userCount={userCount}
      />
    </div>
  );
}
