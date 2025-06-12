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
    roomAdmin?: string
}

export interface MainCanvasProps {
    roomId: string,
    socket: WebSocket,
    slug: string,
    users: string[],
    roomAdmin?: string
    currUserName: string
}

export type Tool =
    | "rectangle"
    | "circle"
    | "line"
    | "pencil"
    | "pointer"

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

export interface Message {
    userId: string;
    text: string;
    sender: string;
    timestamp: number;
}

export interface ChatRoomProps {
    roomId: string;
    userId: string;
    username: string;
    users: string[];
    socket: WebSocket;
    onClose: () => void;
    isOpen: boolean;
    roomAdmin: string
}