import { userIdAtom } from "@/app/store/atoms/authAtoms";
import { initDraw } from "@/draw/draw";
import { MainCanvasProps } from "@/types/types";
import { useAtomValue } from "jotai";
import { useEffect, useRef } from "react";

export default function MainCanvas({
  roomId,
  socket,
  slug,
  userCount,
}: MainCanvasProps) {
  const canvasRef = useRef(null);
  const userId = useAtomValue(userIdAtom);

  useEffect(() => {
    if (!userId || !canvasRef.current) return;
    const canvas = canvasRef.current;

    // console.log(userCount);

    initDraw(canvas, socket, roomId, userId);
  }, [socket, roomId, userId]);

  return <canvas ref={canvasRef} className="border cursor-crosshair" />;
}
