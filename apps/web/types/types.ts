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
    userCount: number,
}