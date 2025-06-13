import axios from "axios";

export async function getExistingShapes(roomId: string) {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/canvas/shapes/${roomId}`, {
            withCredentials: true
        });
        const shapes = response.data.shapes;

        //@ts-ignore
        const parsedShapes = shapes.map((shape) => {
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