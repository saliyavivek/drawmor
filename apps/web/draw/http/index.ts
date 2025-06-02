import axios from "axios";

export async function getExistingShapes(roomId: string) {
    try {
        const response = await axios.get(`http://localhost:3001/api/canvas/shapes/${roomId}`);
        const shapes = response.data.shapes;

        const parsedShapes = shapes.map((shape) => {
            const parsedData = JSON.parse(shape.data);
            return {
                type: shape.type,
                ...parsedData, // spreads x, y, width, height
            };
        });

        return parsedShapes;
    } catch (error) {
        alert("error while fetching existing shapes.");
    }
}