import "./Canvas.css";
import {useContext, useEffect, useRef} from "react";
import {WebGLRenderer} from "../../../webgl/WebGLRenderer";
import {EditorContext} from "../EditorContextProvider";
import {LayerTypeGenerator} from "../../../webgl/layers/LayerTypes";

export function Canvas(){
    const ref = useRef();
    const webGLRenderer = useRef(undefined);

    const editorCtx = useContext(EditorContext);
    useEffect(() => {
        if(!ref.current || !webGLRenderer.current){
            return;
        }
        // initLayers();
    }, [editorCtx.layers])

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
            console.log(change);
            editorCtx.setLayers(prev => {
                return {
                    ...prev,
                    [change.layerId]: {
                        ...prev[change.layerId],
                        ...change.updatedFields
                    }
                }
            })
            webGLRenderer.current.updateLayerData(change);
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
        webGLRenderer.current.loadLayerData(Object.values(editorCtx.layers));
        webGLRenderer.current.render();
    }, [ref]);

    const canvasClick = (ev) => {
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