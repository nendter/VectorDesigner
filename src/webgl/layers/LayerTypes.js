import {ProgramDefinition} from "../programs/Programs";
import {Icons} from "../../components/icon/Icon";
import {ColorUtils} from "../../utils/ColorUtils";
import {v4} from "uuid";

export const LayerType = {
    Triangle: {
        id: "triangle",
        program: "Triangle",
        icon: Icons.Triangle
    }
}

export const LayerTypeGenerator = {
    "triangle": {
        generate: (name) => {
            return {
                id: v4(),
                name: name,
                type: LayerType.Triangle,
                position: [0, 0],
                size: [.1, .1],
                rotation: 0,
                color: ColorUtils.hexToRgba("1188FF"),
            }
        }
    }
}

export const LayerTypeDataGenerator = {
    "triangle": {
        vertexAmount: 3,
        generateVertices: () => {
            return [
                [0, 1],
                [1, -1],
                [-1, -1],
            ]
        },
    }
}