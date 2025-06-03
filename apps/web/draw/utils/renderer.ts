import { Shape } from "@/types/types";
import rough from 'roughjs';

export function drawShape(canvas: HTMLCanvasElement, shape: Shape, isPreview: boolean = false) {
    const rc = rough.canvas(canvas);
    const options = {
        stroke: '#000000',
        strokeWidth: 2,
        roughness: 1.2,
        bowing: 1,
        ...(isPreview && { strokeLineDash: [5, 5] })
    };

    if (shape.type === "rectangle") {
        rc.rectangle(shape.x, shape.y, shape.width, shape.height, options);
    } else if (shape.type === "circle") {
        // For circles, x and y represent the center, radius is the radius
        rc.circle(shape.x, shape.y, shape.radius * 2, options);
    } else if (shape.type === "line") {
        rc.line(shape.startX, shape.startY, shape.endX, shape.endY);
    }
}

export function drawAll(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, shapes: Shape[], previewShape?: Shape) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const shape of shapes) {
        drawShape(canvas, shape);
    }
    if (previewShape) {
        drawShape(canvas, previewShape, true); // Draw preview with dashed style
    }
}