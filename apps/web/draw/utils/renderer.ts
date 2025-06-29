import { Shape } from "@repo/common/types.js";
import rough from 'roughjs';
import { drawArrowhead } from "./shapes";

export function drawShape(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, isDarkMode: boolean, shape: Shape, isPreview: boolean = false) {
    const rc = rough.canvas(canvas);
    const options = {
        stroke: isDarkMode ? "#e6e6e6" : "#000000",
        strokeWidth: 2,
        roughness: 1.2,
        bowing: 1,
        ...(isPreview && { strokeLineDash: [5, 5] })
    };

    if (shape.type === "rectangle") {
        rc.rectangle(shape.x, shape.y, shape.width, shape.height, options);
    } else if (shape.type === "circle") {
        rc.circle(shape.x, shape.y, shape.radius * 2, options); // centerX, centerY, diameter, options
    } else if (shape.type === "line") {
        rc.line(shape.startX, shape.startY, shape.endX, shape.endY, { stroke: isDarkMode ? "#e6e6e6" : "#000000" });
    } else if (shape.type === "pencil") {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = isDarkMode ? "#e6e6e6" : "#000000";
        const [start, ...rest] = shape.points;
        ctx.moveTo(start![0], start![1]);
        for (const [x, y] of rest) {
            ctx.lineTo(x, y);
        }
        ctx.stroke();
        // rc.linearPath(shape.points, {
        //     stroke: "black",
        //     strokeWidth: 2,
        // });
    } else if (shape.type === "arrow") {
        rc.line(shape.startX, shape.startY, shape.endX, shape.endY, { stroke: isDarkMode ? "#e6e6e6" : "#000000", strokeWidth: 2 });
        drawArrowhead(rc, shape.startX, shape.startY, shape.endX, shape.endY, isDarkMode);
    } else if (shape.type === "text") {
        ctx.font = '16px Arial';
        ctx.fillStyle = isDarkMode ? "#e6e6e6" : "#000000";
        ctx.fillText(shape.text, shape.x, shape.y);
    }
}

export function drawAll(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, shapes: Shape[], isDarkMode: boolean, previewShape?: Shape) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const shape of shapes) {
        drawShape(canvas, ctx, isDarkMode, shape);
    }
    if (previewShape) {
        drawShape(canvas, ctx, isDarkMode, previewShape, true); // Draw preview with dashed style
    }
}