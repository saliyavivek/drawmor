import { Shape } from "@repo/common/types.js";
import { getExistingShapes } from "./http";
import { resizeCanvas } from "./utils/canvas";
import { drawAll } from "./utils/renderer";
import { handleWebSocketMessage } from "./utils/websocket";
import { setupMouseEvents } from "./utils/events";

export async function initDraw(
    canvas: HTMLCanvasElement,
    socket: WebSocket,
    roomId: string,
    userId: string,
    selectedTool: { current: string },
    isDarkMode: boolean,
    token: string | null
) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let shapes: Shape[] = await getExistingShapes(roomId, token);

    // Setup canvas resizing
    const handleResize = () => {
        resizeCanvas(canvas, ctx);
        drawAll(canvas, ctx, shapes, isDarkMode);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Setup WebSocket message handling
    socket.onmessage = (ev) => {
        const message = JSON.parse(ev.data);
        handleWebSocketMessage(message, userId, shapes, () => {
            drawAll(canvas, ctx, shapes, isDarkMode);
        });
    };

    // Setup mouse events
    const cleanupMouseEvents = setupMouseEvents(
        canvas,
        ctx,
        socket,
        roomId,
        userId,
        selectedTool,
        shapes,
        isDarkMode
    );

    // Return cleanup function
    return () => {
        window.removeEventListener("resize", handleResize);
        cleanupMouseEvents();
    };
}