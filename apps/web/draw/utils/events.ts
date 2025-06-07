import { Shape } from "@/types/types";
import { getMousePos } from "./canvas";
import { createShape } from "./shapes";
import { drawAll } from "./renderer";
import { sendShapeToServer } from "./websocket";

interface DrawingState {
    isDrawing: boolean;
    startX: number;
    startY: number;
}

let pencilPoints: [number, number][] = [];

export function setupMouseEvents(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    socket: WebSocket,
    roomId: string,
    userId: string,
    selectedTool: { current: string },
    shapes: Shape[]
) {
    const state: DrawingState = {
        isDrawing: false,
        startX: 0,
        startY: 0
    };

    const onMouseDown = (e: MouseEvent) => {
        state.isDrawing = true;
        const pos = getMousePos(canvas, e);
        state.startX = pos.x;
        state.startY = pos.y;

        if (selectedTool.current === "pencil") {
            pencilPoints = [[pos.x, pos.y]];
        }
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!state.isDrawing) return;
        const pos = getMousePos(canvas, e);

        if (selectedTool.current === "pencil") {
            pencilPoints.push([pos.x, pos.y]);

            // Draw live preview
            const previewShape: Shape = {
                type: "pencil",
                points: pencilPoints
            };
            drawAll(canvas, ctx, shapes, previewShape);
            return;
        }

        //                                                     startX,       startY,       endX,  endY
        const previewShape = createShape(selectedTool.current, state.startX, state.startY, pos.x, pos.y);
        if (previewShape) {
            drawAll(canvas, ctx, shapes, previewShape);
        }
    };

    const onMouseUp = (e: MouseEvent) => {
        if (!state.isDrawing) return;
        state.isDrawing = false;
        const pos = getMousePos(canvas, e);

        let shape: Shape | null = null;

        if (selectedTool.current === "pencil") {
            pencilPoints.push([pos.x, pos.y]);
            shape = {
                type: "pencil",
                points: pencilPoints
            };
        } else {
            shape = createShape(selectedTool.current, state.startX, state.startY, pos.x, pos.y);
        }

        if (!shape) return;

        shapes.push(shape);
        sendShapeToServer(socket, roomId, shape, userId);
        drawAll(canvas, ctx, shapes);
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseup", onMouseUp);

    // Return cleanup function
    return () => {
        canvas.removeEventListener("mousedown", onMouseDown);
        canvas.removeEventListener("mousemove", onMouseMove);
        canvas.removeEventListener("mouseup", onMouseUp);
        window.removeEventListener("mouseup", onMouseUp);
    };
}