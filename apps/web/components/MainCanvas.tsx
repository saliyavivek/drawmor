"use client";

import { userIdAtom } from "@/app/store/atoms/authAtoms";
import { initDraw } from "@/draw/draw";
import { MainCanvasProps, Tool } from "@/types/types";
import { useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";
import DrawingToolbar from "./DrawingToolbar";
import CanvasHeader from "./CanvasHeader";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ChatRoom from "./ChatRoom";
import { useTheme } from "next-themes";
import { getPosFromEvent } from "@/draw/utils/canvas";
import { v4 as uuidv4 } from "uuid";
import { sendShapeToServer } from "@/draw/utils/websocket";
import { TextShape } from "@repo/common/types.js";

export default function MainCanvas({
  roomId,
  socket,
  slug,
  users,
  currUserName,
  roomAdmin = currUserName,
  token,
}: MainCanvasProps) {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  const canvasRef = useRef(null);
  const userId = useAtomValue(userIdAtom);
  const router = useRouter();

  const [selectedTool, setSelectedTool] = useState<Tool>("pointer");

  const selectedToolRef = useRef(selectedTool);
  selectedToolRef.current = selectedTool;

  const [showChat, setShowChat] = useState(false);
  // const currentUsername = useAtomValue(nameAtom);

  const [textInput, setTextInput] = useState<{
    visible: boolean;
    x: number;
    y: number;
    value: string;
  } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!userId || !canvasRef.current) return;
    const canvas = canvasRef.current;

    initDraw(
      canvas,
      socket,
      roomId,
      userId,
      selectedToolRef,
      isDarkMode,
      token
    );
  }, [socket, roomId, userId, isDarkMode]);

  function handleLeave() {
    socket.send(
      JSON.stringify({
        type: "leave",
        payload: {
          roomId,
        },
      })
    );
    router.push("/");
    toast("You have left the room.");
  }

  const handleDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getPosFromEvent(e, canvasRef.current!);

    setTextInput({ visible: true, x: pos.x, y: pos.y, value: "" });

    // Focus after showing input (delayed)
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleTextSubmit = () => {
    if (!textInput?.value.trim()) {
      setTextInput(null);
      return;
    }

    const newTextShape: TextShape = {
      type: "text",
      x: textInput.x,
      y: textInput.y,
      text: textInput.value,
    };

    sendShapeToServer(socket, roomId, newTextShape, userId!);

    setTextInput(null); // Remove input
  };

  if (!userId) {
    return <div>Loading user...</div>;
  } else {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <CanvasHeader
          slug={slug}
          users={users}
          handleLeave={handleLeave}
          setShowChat={setShowChat}
          roomAdmin={roomAdmin}
          currentUsername={currUserName}
        />
        <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2">
          <DrawingToolbar
            selectedTool={selectedTool}
            onToolChange={setSelectedTool}
          />
        </div>
        <div className="flex flex-1 overflow-hidden">
          <canvas
            ref={canvasRef}
            className={`border h-screen overflow-hidden touch-none ${selectedTool !== "pointer" && "cursor-crosshair"}`}
            onDoubleClick={(e) => {
              if (selectedTool === "pointer") {
                handleDoubleClick(e);
              }
            }}
          />
        </div>
        {showChat && (
          <div
            className={`w-1/4 min-w-[300px] h-screen transition-all duration-300 absolute right-0 top-16`}
          >
            <ChatRoom
              roomId={roomId}
              userId={userId}
              username={currUserName}
              users={users}
              socket={socket}
              onClose={() => setShowChat(false)}
              isOpen={showChat}
              roomAdmin={roomAdmin}
              token={token}
            />
          </div>
        )}
        {textInput?.visible && (
          <input
            ref={inputRef}
            value={textInput.value}
            onChange={(e) =>
              setTextInput((prev) => prev && { ...prev, value: e.target.value })
            }
            onBlur={handleTextSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleTextSubmit();
            }}
            className="absolute text-[16px] p-[2px] border border-0 outline-none z-10"
            style={{ left: textInput.x, top: 65 + textInput.y }}
          />
        )}
      </div>
    );
  }
}
