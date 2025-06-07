import { Shape } from "@/types/types";

export function createRectangleShape(startX: number, startY: number, endX: number, endY: number): Shape {
    return {
        type: "rectangle",
        x: Math.min(startX, endX),
        y: Math.min(startY, endY),
        width: Math.abs(endX - startX),
        height: Math.abs(endY - startY),
    };
    /*
        Why Math.min(startX, endX)?
        
        Imagine a user drags from:
            Bottom-right to Top-left
            Or from any direction that's not top-left to bottom-right
            
        In that case:
            startX might be greater than endX
            And our rectangle would have a negative width or draw in the wrong direction
    
        So, Math.min sets the rectangle's origin (x, y) to the upper-left corner regardless of drag direction.

        Example:

        (startX, startY) = (200, 200)
        (endX, endY) = (100, 100)

        Without Math.min, you'd get:

        x = 200, y = 200
        width = -100, height = -100
        
        With Math.min + Math.abs:

        x = 100, y = 100
        width = 100, height = 100
    */
}

export function createCircleShape(centerX: number, centerY: number, endX: number, endY: number): Shape {
    /*
        This uses the Pythagorean theorem to calculate the distance between two points: (centerX, centerY) and (endX, endY).

        Formula: distance= root( (x2​ − x1)^2 + (y2 - y1)^2 )
​
        In this case:

        centerX, centerY = where the user first clicked (center of the circle)

        endX, endY = current mouse position while dragging (edge of the circle)

        So the radius is the distance from the center to the edge = how far the user has dragged.
    */

    const radius = Math.sqrt(
        Math.pow(endX - centerX, 2) + Math.pow(endY - centerY, 2)
    );
    return {
        type: "circle",
        x: centerX,
        y: centerY,
        radius: radius,
    };
}

export function createLineShape(startX: number, startY: number, endX: number, endY: number): Shape {
    return {
        type: "line",
        startX,
        startY,
        endX,
        endY
    }
}

export function createShape(tool: string, startX: number, startY: number, endX: number, endY: number): Shape | null {
    if (tool === "rectangle") {
        return createRectangleShape(startX, startY, endX, endY);
    } else if (tool === "circle") {
        return createCircleShape(startX, startY, endX, endY);
    } else if (tool === "line") {
        return createLineShape(startX, startY, endX, endY);
    }
    return null;
}