import {Overlay} from "../../../layout/overlay/Overlay";
import {NarrowNumberInput} from "../../../inputs/narrow-number/NarrowNumberInput";
import "./EditorDesignOverlay.css";
import {Icon, Icons} from "../../../icon/Icon";

export function EditorDesignOverlay({ layers, changeLayer, selectedLayers }){

    const updateSelectedLayer = (updatedFields) => {
        changeLayer({
            layerId: selectedLayers[0],
            updatedFields: updatedFields
        })
    }

    return (
        <Overlay title={"Design"}>
            {(selectedLayers?.length > 0 && layers[selectedLayers[0]] !== undefined) ? <>
                <div className="transformation-grid">
                    <NarrowNumberInput label={"X"} value={layers[selectedLayers[0]].position[0]} onChange={(ev) => {
                        updateSelectedLayer({
                            position: [
                                Number(ev.target.value),
                                layers[selectedLayers[0]].position[1]
                            ]
                        })
                    }}></NarrowNumberInput>
                    <NarrowNumberInput label={"Y"} value={layers[selectedLayers[0]].position[1]} onChange={(ev) => {
                        updateSelectedLayer({
                            position: [
                                layers[selectedLayers[0]].position[0],
                                Number(ev.target.value),
                            ]
                        })
                    }}></NarrowNumberInput>
                    <div></div>

                    <NarrowNumberInput label={"W"} value={layers[selectedLayers[0]].size[0]} onChange={(ev) => {
                        updateSelectedLayer({
                            size: [
                                Number(ev.target.value),
                                layers[selectedLayers[0]].size[1]
                            ]
                        })
                    }}></NarrowNumberInput>
                    <NarrowNumberInput label={"H"} value={layers[selectedLayers[0]].size[1]} onChange={(ev) => {
                        updateSelectedLayer({
                            size: [
                                layers[selectedLayers[0]].size[0],
                                Number(ev.target.value),
                            ]
                        })
                    }}></NarrowNumberInput>
                    <div></div>

                    <NarrowNumberInput label={"R"} value={layers[selectedLayers[0]].rotation?.toFixed(0)} onChange={(ev) => {
                        updateSelectedLayer({
                            rotation: Number(ev.target.value)
                        })
                    }}></NarrowNumberInput>
                </div>
            </>:<>
                <p className={"hint"}>No Layer Selected!</p>
            </>}
        </Overlay>
    )
}