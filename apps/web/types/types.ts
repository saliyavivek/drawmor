export interface AuthFormProps {
    mode: "signin" | "signup";
    onSubmit: (data: {
        username: string;
        password: string;
    }) => Promise<void>;
    isLoading?: boolean;
    title?: string;
    description?: string;
    submitButtonText?: string;
    linkText?: string;
    linkHref?: string;
}

export type TokenPayload = {
    userId: string;
    username: string;
    iat?: number;
    exp?: number;
};

export interface SocketCanvasProps {
    roomId: string,
    slug: string,
    currUserName: string,
}

export interface MainCanvasProps {
    roomId: string,
    socket: WebSocket,
    slug: string,
    users: string[],
}

export type Tool =
    | "rectangle"
    | "circle"
    | "line"
    | "pencil"

export type RectangleShape = {
    type: "rectangle";
    x: number;
    y: number;
    width: number;
    height: number;
};

export type CircleShape = {
    type: "circle";
    x: number;
    y: number;
    radius: number;
};

export type LineShape = {
    type: "line",
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

export type PencilShape = {
    type: "pencil",
    points: [number, number][];
}

export type Shape = RectangleShape | CircleShape | LineShape | PencilShape;

export type DrawingOptions = {
    stroke?: string;
    strokeWidth?: number;
    roughness?: number;
    bowing?: number;
    strokeLineDash?: number[];
};

export interface CanvasHeaderProps {
    slug: string;
    users: any[];
    handleLeave: () => void;
}