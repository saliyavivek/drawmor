import { Shape } from "@/types/types";
import rough from 'roughjs';

export function drawShape(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, shape: Shape, isPreview: boolean = false) {
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
        rc.circle(shape.x, shape.y, shape.radius * 2, options); // centerX, centerY, diameter, options
    } else if (shape.type === "line") {
        rc.line(shape.startX, shape.startY, shape.endX, shape.endY);
    } else if (shape.type === "pencil") {
        ctx.beginPath();
        ctx.lineWidth = 4;
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
    }
}

export function drawAll(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, shapes: Shape[], previewShape?: Shape) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const shape of shapes) {
        drawShape(canvas, ctx, shape);
    }
    if (previewShape) {
        drawShape(canvas, ctx, previewShape, true); // Draw preview with dashed style
    }
}