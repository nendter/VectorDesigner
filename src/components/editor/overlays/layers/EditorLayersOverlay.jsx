import {Overlay} from "../../../layout/overlay/Overlay";
import {Icon, Icons} from "../../../icon/Icon";
import "./EditorLayersOverlay.css";

export function EditorLayersOverlay({layers, setLayers, selectedLayers, setSelectedLayers}){

    const deleteLayer = (ev, id) => {
        ev.stopPropagation();
        setLayers(prev => {
            const {[id]: _, ...next} = prev;
            return next;
        })
    }

    return (
        <Overlay title={"Layers"}>
            <div className="layers">
                {Object.values(layers).map(layer =>
                    <div key={layer.id}
                            className={`layer ${selectedLayers.includes(layer.id) ? "selected":""}`}
                            onClick={() => setSelectedLayers([layer.id])}>
                        <Icon icon={layer.type.icon}></Icon>
                        <p>{layer.name}</p>
                        <button className={"size-18 delete"} onClick={(ev) => deleteLayer(ev, layer.id)}>
                            <Icon icon={Icons.Delete}></Icon>
                        </button>
                    </div>
                )}
            </div>
        </Overlay>
    )
}