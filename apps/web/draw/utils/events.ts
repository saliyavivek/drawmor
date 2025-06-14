import { Shape } from "@repo/common/types.js";
import { getPosFromEvent } from "./canvas";
import { createShape } from "./shapes";
import { drawAll } from "./renderer";
import { sendShapeToServer, sendUpdatedShapeToServer } from "./websocket";
import { getClickedShape } from "./selection";

interface DrawingState {
    isDragging: boolean;
    isDrawing: boolean;
    startX: number;
    startY: number;
}

let pencilPoints: [number, number][] = [];

let selectedShape: Shape | null = null;
let offsetX = 0;
let offsetY = 0;

export function setupMouseEvents(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    socket: WebSocket,
    roomId: string,
    userId: string,
    selectedTool: { current: string },
    shapes: Shape[],
    isDarkMode: boolean
) {
    const state: DrawingState = {
        isDragging: false,
        isDrawing: false,
        startX: 0,
        startY: 0
    };

    const onMouseDown = (e: MouseEvent) => {
        const pos = getPosFromEvent(e, canvas);
        if (selectedTool.current === "pointer") {
            state.isDragging = true;
            const clicked = getClickedShape(shapes, pos.x, pos.y);
            if (clicked) {
                selectedShape = clicked;
                if (selectedShape.type === "rectangle" || selectedShape.type === "circle") {
                    offsetX = pos.x - selectedShape.x;
                    offsetY = pos.y - selectedShape.y;
                    /*
                        what are offsetX and offsetY?

                        basically, it keeps track of how far the user has clicked from the left corner(for rect) or the center(for circle)

                        so that when dragging the shape, we maintain the same distance

                        else the shape will jump to the user's cursor

                    */
                }
            }
            return;
        }
        state.isDrawing = true;
        state.startX = pos.x;
        state.startY = pos.y;


        if (selectedTool.current === "pencil") {
            pencilPoints = [[pos.x, pos.y]];
        }
    };

    const onMouseMove = (e: MouseEvent) => {
        const pos = getPosFromEvent(e, canvas);

        if (selectedTool.current !== "pointer") {
            canvas.style.cursor = "crosshair";
        } else {
            const hoveredShape = getClickedShape(shapes, pos.x, pos.y);
            if (hoveredShape) {
                canvas.style.cursor = "move";
            } else {
                canvas.style.cursor = "auto";
            }
        }


        if (selectedShape && state.isDragging && selectedTool.current === "pointer") {
            if (selectedShape.type === "rectangle" || selectedShape.type === "circle") {
                selectedShape.x = pos.x - offsetX;
                selectedShape.y = pos.y - offsetY;
            }
            drawAll(canvas, ctx, shapes, isDarkMode);
            return;
        }


        if (!state.isDrawing) return;

        if (selectedTool.current === "pencil") {
            pencilPoints.push([pos.x, pos.y]);

            // Draw live preview
            const previewShape: Shape = {
                type: "pencil",
                points: pencilPoints
            };
            drawAll(canvas, ctx, shapes, isDarkMode, previewShape);
            return;
        }

        //                                                     startX,       startY,       endX,  endY
        const previewShape = createShape(selectedTool.current, state.startX, state.startY, pos.x, pos.y, false);
        if (previewShape) {
            drawAll(canvas, ctx, shapes, isDarkMode, previewShape);
        }
    };

    const onMouseUp = (e: MouseEvent) => {
        if (selectedShape && state.isDragging && selectedTool.current === "pointer") {
            sendUpdatedShapeToServer(socket, roomId, selectedShape, userId);

            selectedShape = null;
            state.isDragging = false;
            return;
        }

        if (!state.isDrawing) return;
        state.isDrawing = false;
        const pos = getPosFromEvent(e, canvas);

        let shape: Shape | null = null;

        if (selectedTool.current === "pencil") {
            pencilPoints.push([pos.x, pos.y]);
            shape = {
                type: "pencil",
                points: pencilPoints
            };
        } else {
            shape = createShape(selectedTool.current, state.startX, state.startY, pos.x, pos.y, true);
        }

        if (!shape) return;

        shapes.push(shape);
        sendShapeToServer(socket, roomId, shape, userId);
        drawAll(canvas, ctx, shapes, isDarkMode);
    };

    const onTouchStart = (e: TouchEvent) => {
        e.preventDefault();
        const pos = getPosFromEvent(e, canvas);
        onMouseDown({
            clientX: pos.x,
            clientY: pos.y
        } as unknown as MouseEvent); // type-cast to reuse
    };

    const onTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        const pos = getPosFromEvent(e, canvas);
        onMouseMove({
            clientX: pos.x,
            clientY: pos.y
        } as unknown as MouseEvent);
    };

    const onTouchEnd = (e: TouchEvent) => {
        e.preventDefault();
        const pos = getPosFromEvent(e, canvas);
        onMouseUp({
            clientX: pos.x,
            clientY: pos.y
        } as unknown as MouseEvent);
    };


    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);

    canvas.addEventListener("touchstart", onTouchStart);
    canvas.addEventListener("touchmove", onTouchMove);
    canvas.addEventListener("touchend", onTouchEnd);

    window.addEventListener("mouseup", onMouseUp);

    // Return cleanup function
    return () => {
        canvas.removeEventListener("mousedown", onMouseDown);
        canvas.removeEventListener("mousemove", onMouseMove);
        canvas.removeEventListener("mouseup", onMouseUp);

        canvas.removeEventListener("touchstart", onTouchStart);
        canvas.removeEventListener("touchmove", onTouchMove);
        canvas.removeEventListener("touchend", onTouchEnd);

        window.removeEventListener("mouseup", onMouseUp);
    };
}