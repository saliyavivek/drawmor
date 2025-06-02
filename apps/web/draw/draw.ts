import { getExistingShapes } from "./http";

type Shape = {
    type: "rectangle";
    x: number;
    y: number;
    width: number;
    height: number;
};

export async function initDraw(canvas: HTMLCanvasElement, socket: WebSocket, roomId: string, userId: string) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let shapes: Shape[] = await getExistingShapes(roomId);
    // Drawing
    const drawAll = (previewShape?: Shape) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const shape of shapes) {
            drawShape(shape);
        }
        if (previewShape) {
            ctx.save(); // Save current settings
            ctx.setLineDash([5, 5]); // Temporarily sets the stroke style to dashed
            drawShape(previewShape);
            ctx.restore(); // Revert to previous settings or undoes the dashed setting so the real shapes aren’t dashed.
        }
    };

    const drawShape = (shape: Shape) => {
        ctx.beginPath();
        ctx.rect(shape.x, shape.y, shape.width, shape.height);
        ctx.stroke();
    };

    const resizeCanvas = () => {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);

        drawAll();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);


    let isDrawing = false;
    let startX = 0;
    let startY = 0;

    socket.onmessage = (ev) => {
        const message = JSON.parse(ev.data);

        if (message.type === "draw_shape") {
            // if (message.payload.senderId === userId) return;

            shapes.push(message.payload.shape);
            drawAll();
        }
    }

    const getMousePos = (e: MouseEvent) => {
        /*
            e.clientX and e.clientY give you the mouse position relative to the viewport, not the canvas. If your canvas is not at the top-left corner of the page (e.g. if it has margins or the window is resized), clientX/Y will be offset.

            By subtracting the canvas's bounding box position (using getBoundingClientRect()), you translate the position to be relative to the canvas itself.

            Let’s say:

            Canvas starts at (100, 50) in the page
            Mouse is at (150, 80)

            Then:

            rect.left = 100;
            rect.top = 50;
            e.clientX = 150;
            e.clientY = 80;

            => x = 150 - 100 = 50
            => y = 80 - 50 = 30
            So inside the canvas, you're at (50, 30) — correct!
        */
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };

    const onMouseDown = (e: MouseEvent) => {
        isDrawing = true;
        const pos = getMousePos(e);
        startX = pos.x;
        startY = pos.y;

        return () => {
            canvas.removeEventListener("mousedown", onMouseDown);
        };
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!isDrawing) return;
        const pos = getMousePos(e);
        const previewShape: Shape = {
            type: "rectangle",
            x: Math.min(startX, pos.x),
            y: Math.min(startY, pos.y),
            width: Math.abs(pos.x - startX),
            height: Math.abs(pos.y - startY),
        };
        drawAll(previewShape); // While dragging, we draw a temporary shape using dashed lines. This shape is not stored in shapes[].

        return () => {
            canvas.removeEventListener("mousemove", onMouseMove);
        };
    };

    const onMouseUp = (e: MouseEvent) => {
        if (!isDrawing) return;
        isDrawing = false;
        const pos = getMousePos(e);
        const shape: Shape = {
            type: "rectangle",
            x: Math.min(startX, pos.x),
            y: Math.min(startY, pos.y),
            width: Math.abs(pos.x - startX),
            height: Math.abs(pos.y - startY),
        };
        shapes.push(shape);

        // console.log("inside mouseup");
        socket.send(JSON.stringify({
            type: "draw_shape",
            payload: {
                roomId,
                shape: JSON.stringify(shape),
                sender: userId
            }
        }))

        drawAll(); // draw all committed shapes

        return () => {
            canvas.removeEventListener("mouseup", onMouseUp);
        };
    };

    canvas.addEventListener("mousedown", onMouseDown,);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseup", onMouseUp);
}