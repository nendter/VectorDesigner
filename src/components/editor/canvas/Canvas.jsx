import "./Canvas.css";
import {useContext, useEffect, useRef} from "react";
import {WebGLTest} from "../../../webgl/WebGLTest";
import {WebGLRenderer} from "../../../webgl/WebGLRenderer";
import {EditorContext} from "../EditorContextProvider";

export function Canvas(){
    const ref = useRef();
    const webGLRenderer = useRef(undefined);

    const editorCtx = useContext(EditorContext);
    useEffect(() => {
        if(!ref.current || !webGLRenderer.current){
            return;
        }
        renderLayers();
    }, [editorCtx.layers])

    useEffect(() => {
        try{
            webGLRenderer.current = new WebGLRenderer(ref.current);
        }catch(e){
            // TODO: Show Toast or sth, that webgl isn't available
        }
        renderLayers();
    }, [ref]);

    const renderLayers = () => {
        webGLRenderer.current.renderLayers(editorCtx.layers);
    }

    return (
        <canvas ref={ref} className={"canvas"}></canvas>
    )
}