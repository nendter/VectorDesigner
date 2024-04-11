import "./Canvas.css";
import {useContext, useEffect, useRef} from "react";
import {WebGLRenderer} from "../../../rendering/WebGLRenderer";
import {EditorContext} from "../EditorContextProvider";
import {LayerTypeGenerator} from "../../../rendering/layers/LayerTypes";

export function Canvas(){
    const ref = useRef();
    const webGLRenderer = useRef(undefined);

    const editorCtx = useContext(EditorContext);

    const processingQueue = useRef(false);
    useEffect(() => {
        if(!ref.current || !webGLRenderer.current){
            return;
        }
        if(processingQueue.current){
            return;
        }
        processingQueue.current = true;
        processQueue();
    }, [editorCtx.changeQueue])

    const processQueue = async () => {
        while(editorCtx.changeQueue.length > 0){
            const change = editorCtx.changeQueue.shift();
            editorCtx.setLayers(prev => {
                return {
                    ...prev,
                    [change.layerId]: {
                        ...prev[change.layerId],
                        ...change.updatedFields
                    }
                }
            })
            webGLRenderer.current.updateLayer(change);
        }
        webGLRenderer.current.render();
        processingQueue.current = false;
    }

    useEffect(() => {
        try{
            webGLRenderer.current = new WebGLRenderer(ref.current);
        }catch(e){
            // TODO: Show Toast or sth, that webgl isn't available
        }
        webGLRenderer.current.loadLayers(editorCtx.layers);
        webGLRenderer.current.render();
    }, [ref]);

    const canvasClick = (ev) => {

        console.log(ev);
        // TODO: Detect the layer that's been clicked
        const pos = ev

        return;

        editorCtx.setLayers(prev => {
            const newLayer = LayerTypeGenerator[editorCtx.tool.id].generate("Triangle");
            return {
                ...prev,
                [newLayer.id]: newLayer
            }
        })
    }

    return (
        <canvas ref={ref} className={"canvas"} onClick={canvasClick}></canvas>
    )
}