import "./Canvas.css";
import {useContext, useEffect, useRef} from "react";
import {WebGLTest} from "../../../webgl/WebGLTest";
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
        initLayers();
    }, [editorCtx.layers])

    useEffect(() => {
        try{
            webGLRenderer.current = new WebGLRenderer(ref.current);
        }catch(e){
            // TODO: Show Toast or sth, that webgl isn't available
        }
        initLayers();
    }, [ref]);

    const initLayers = () => {
        webGLRenderer.current.initLayers(Object.values(editorCtx.layers));
    }

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