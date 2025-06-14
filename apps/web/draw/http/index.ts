import axios from "axios";

export async function getExistingShapes(roomId: string, token: string | null) {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/canvas/shapes/${roomId}`, {
            headers: {
                Authorization: token
            }
        });
        const shapes = response.data.shapes;

        const parsedShapes = shapes.map((shape: any) => {
            const parsedData = JSON.parse(shape.data);
            return {
                id: shape.id,
                type: shape.type,
                ...parsedData, // spreads x, y, width, height
            };
        });

        return parsedShapes;
    } catch (error) {
        alert("error while fetching existing shapes.");
    }
}