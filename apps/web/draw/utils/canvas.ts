export function resizeCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
}

export function getMousePos(canvas: HTMLCanvasElement, e: MouseEvent) {
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
}

export function getPosFromEvent(e: MouseEvent | TouchEvent | React.MouseEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement): { x: number, y: number } {
    const rect = canvas.getBoundingClientRect();

    if (e instanceof TouchEvent) {
        const touch = e.touches[0] || e.changedTouches[0]; // fallback for touchend
        if (!touch) return { x: 0, y: 0 }; // safe fallback
        return {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top,
        };
    }

    return {
        x: (e as MouseEvent).clientX - rect.left,
        y: (e as MouseEvent).clientY - rect.top,
    };
}
