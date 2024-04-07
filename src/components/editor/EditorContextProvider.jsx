import {createContext, useState} from "react";
import {EditorTools} from "./toolbar/EditorToolBar";
import {LayerType} from "../../webgl/layers/LayerTypes";
import {vec4} from "gl-matrix";
import {ColorUtils} from "../../utils/ColorUtils";

export const EditorContext = createContext(undefined);

export function EditorContextProvider({ children }){
    const [tool, setTool] = useState(EditorTools[0]);
    const [zoom, setZoom] = useState(1);
    /**
     * Every object to draw is a layer. Earlier in the list, means drawn first / underneath the later items
     */
    const [layers, setLayers] = useState([
        {
            type: LayerType.Triangle,
            position: [0.1, 0.1],
            size: [.1, .1],
            rotation: 0,
            fill: ColorUtils.hexToRgba("333333"),
        },
        {
            type: LayerType.Triangle,
            position: [-0.4, -0.4],
            size: [.1, .1],
            rotation: 30 * (Math.PI / 180),
            fill: ColorUtils.hexToRgba("1188FF"),
        }
    ])
    return (
        <EditorContext.Provider value={{
            tool: tool,
            setTool: setTool,

            zoom: zoom,
            setZoom: setZoom,

            layers: layers,
            setLayers: setLayers
        }}>
            {children}
        </EditorContext.Provider>
    )
}