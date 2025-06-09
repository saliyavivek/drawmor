"use client";

import { nameAtom, userIdAtom } from "@/app/store/atoms/authAtoms";
import { initDraw } from "@/draw/draw";
import { MainCanvasProps, Tool } from "@/types/types";
import { useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";
import DrawingToolbar from "./DrawingToolbar";
import CanvasHeader from "./CanvasHeader";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ChatRoom from "./ChatRoom";

export default function MainCanvas({
  roomId,
  socket,
  slug,
  users,
}: MainCanvasProps) {
  const canvasRef = useRef(null);
  const userId = useAtomValue(userIdAtom);
  const router = useRouter();

  const [selectedTool, setSelectedTool] = useState<Tool>("rectangle");

  const selectedToolRef = useRef(selectedTool);
  selectedToolRef.current = selectedTool;

  const [showChat, setShowChat] = useState(false);
  const currentUsername = useAtomValue(nameAtom);

  useEffect(() => {
    if (!userId || !canvasRef.current) return;
    const canvas = canvasRef.current;

    initDraw(canvas, socket, roomId, userId, selectedToolRef);
  }, [socket, roomId, userId]);

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
        />
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <DrawingToolbar
            selectedTool={selectedTool}
            onToolChange={setSelectedTool}
          />
        </div>
        <div className="flex flex-1 overflow-hidden">
          <canvas
            ref={canvasRef}
            className={`border h-screen overflow-hidden ${selectedTool !== "pointer" && "cursor-crosshair"}`}
          />
        </div>
        {showChat && (
          <div
            className={`w-1/4 min-w-[300px] h-screen transition-all duration-300 absolute right-0 top-16`}
          >
            <ChatRoom
              roomId={roomId}
              userId={userId}
              username={currentUsername!}
              users={users}
              socket={socket}
              onClose={() => setShowChat(false)}
              isOpen={showChat}
            />
          </div>
        )}
      </div>
    );
  }
}
