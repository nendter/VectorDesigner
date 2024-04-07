import {Program} from "../programs/Programs";
import {Icons} from "../../components/icon/Icon";

export const LayerType = {
    Triangle: {
        id: "triangle",
        programId: Program.Triangle.id,
        icon: Icons.Triangle
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