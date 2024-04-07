import {Program} from "../programs/Programs";

export const LayerType = {
    Triangle: {
        id: "triangle",
        programId: Program.Triangle.id
    }
}

export const LayerTypeDataGenerator = {
    "triangle": {
        generateVertices: () => {
            return [
                [0, 1],
                [1, -1],
                [-1, -1],
            ]
        },
    }
}