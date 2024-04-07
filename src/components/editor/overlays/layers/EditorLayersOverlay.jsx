import {Overlay} from "../../../layout/overlay/Overlay";
import {Icon} from "../../../icon/Icon";
import "./EditorLayersOverlay.css";

export function EditorLayersOverlay({layers, setLayers, selectedLayers, setSelectedLayers}){
    return (
        <Overlay title={"Layers"}>
            <div className="layers">
                {layers.map(layer =>
                    <button key={layer.id}
                            className={`layer ${selectedLayers.includes(layer.id) ? "selected":""}`}
                            onClick={() => setSelectedLayers([layer.id])}>
                        <Icon icon={layer.type.icon}></Icon>
                        <p>{layer.name}</p>
                    </button>
                )}
            </div>
        </Overlay>
    )
}