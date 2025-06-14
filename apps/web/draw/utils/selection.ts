import { Shape } from "@repo/common/types.js";

export function getClickedShape(shapes: Shape[], x: number, y: number): Shape | null {
    for (let i = shapes.length - 1; i >= 0; i--) {
        const shape = shapes[i];

        if (!shape) {
            console.log("No shape found");
            return null;
        };

        if (shape.type === "rectangle") {
            if (
                x >= shape.x &&
                x <= shape.x + shape.width &&
                y >= shape.y &&
                y <= shape.y + shape.height
            ) {
                return shape;
            }
        }

        if (shape.type === "circle") {
            const dx = x - shape.x;
            const dy = y - shape.y;
            if (Math.sqrt(dx * dx + dy * dy) <= shape.radius) {
                return shape;
            }
        }
    }

    return null;
}