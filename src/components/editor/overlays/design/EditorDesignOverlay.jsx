import {Overlay} from "../../../layout/overlay/Overlay";

export function EditorDesignOverlay({ layers, setLayers, selectedLayers, setSelectedLayers }){
    return (
        <Overlay title={"Design"}>
            {selectedLayers?.length > 0 ? <>

            </>:<>
                <p className={"hint"}>No Layer Selected!</p>
            </>}
        </Overlay>
    )
}