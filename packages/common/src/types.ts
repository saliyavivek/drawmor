export type RectangleShape = {
    id?: string;
    type: "rectangle";
    x: number;
    y: number;
    width: number;
    height: number;
};

export type CircleShape = {
    id?: string;
    type: "circle";
    x: number;
    y: number;
    radius: number;
};

export type LineShape = {
    id?: string;
    type: "line",
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

export type PencilShape = {
    id?: string;
    type: "pencil",
    points: [number, number][];
}

export type ArrowShape = {
    id?: string;
    type: "arrow";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

export type Shape = RectangleShape | CircleShape | LineShape | PencilShape | ArrowShape;