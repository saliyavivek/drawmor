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
      <div>
        <CanvasHeader slug={slug} users={users} handleLeave={handleLeave} />
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <DrawingToolbar
            selectedTool={selectedTool}
            onToolChange={setSelectedTool}
          />
        </div>
        <canvas
          ref={canvasRef}
          className="border h-screen overflow-hidden cursor-crosshair"
        />
      </div>
    );
  }
}
