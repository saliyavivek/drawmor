import { Shape } from "@/types/types";

export function handleWebSocketMessage(
    message: any,
    userId: string,
    shapes: Shape[],
    onShapeAdded: () => void
) {
    if (message.type === "draw_shape") {
        // Don't process messages for yourself to avoid duplicates
        if (message.payload.sender.userId === userId) return;

        const shapeData = typeof message.payload.shape === 'string'
            ? JSON.parse(message.payload.shape)
            : message.payload.shape;

        // Only add valid shapes
        if (shapeData && (shapeData.type === "rectangle" || shapeData.type === "circle" || shapeData.type === "line" || shapeData.type === "pencil" || shapeData.type === "arrow")) {
            shapes.push(shapeData);
            onShapeAdded();
        }
    }
}

export function sendShapeToServer(socket: WebSocket, roomId: string, shape: Shape, userId: string) {
    socket.send(JSON.stringify({
        type: "draw_shape",
        payload: {
            roomId,
            shape: JSON.stringify(shape),
            sender: userId
        }
    }));
}