import "./Canvas.css";
import {useContext, useEffect, useRef, useState} from "react";
import {WebGLRenderer} from "../../../rendering/WebGLRenderer";
import {EditorContext} from "../EditorContextProvider";
import {useKeyTracker} from "../../hooks/useKeys";
import {mat4} from "gl-matrix";

export function Canvas() {
    const ref = useRef();
    const webGLRenderer = useRef(undefined);

    const editorCtx = useContext(EditorContext);

    const processingQueue = useRef(false);
    useEffect(() => {
        if (!ref.current || !webGLRenderer.current) {
            return;
        }
        if (processingQueue.current) {
            return;
        }
        processingQueue.current = true;
        processQueue();
    }, [editorCtx.changeQueue])

    const processQueue = async () => {
        while (editorCtx.changeQueue.length > 0) {
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
        try {
            webGLRenderer.current = new WebGLRenderer(ref.current);
        } catch (e) {
            // TODO: Show Toast or sth, that webgl isn't available
        }
        webGLRenderer.current.loadLayers(editorCtx.layers);
        webGLRenderer.current.render();
    }, [ref]);

    // const canvasClick = (ev) => {
    //
    //     console.log(ev);
    //     console.log(editorCtx.layers);
    //     // TODO: Detect the layer that's been clicked
    //     const pos = ev
    //
    //     return;
    //
    //     editorCtx.setLayers(prev => {
    //         const newLayer = LayerTypeGenerator[editorCtx.tool.id].generate("Triangle");
    //         return {
    //             ...prev,
    //             [newLayer.id]: newLayer
    //         }
    //     })
    // }

    const [spacePressed, setSpacePressed] = useState(false);
    const [movingCanvas, setMovingCanvas] = useState(false);
    const keyMapRef = useKeyTracker({
        " ": (pressed) => setSpacePressed(pressed)
    });

    const canvasMouseDown = (ev) => {
        if (spacePressed) {
            setMovingCanvas(true);
            return;
        }

    }
    const canvasMouseMove = (ev) => {
        if (movingCanvas) {
            mat4.translate(webGLRenderer.current.vMatrix, webGLRenderer.current.vMatrix, [ev.movementX, ev.movementY, 0])
            webGLRenderer.current.render();
            return;
        }
    }
    const canvasMouseUp = (ev) => {
        setMovingCanvas(false);
    }

    return (
        <canvas ref={ref} className={`canvas ${spacePressed ? "space-pressed" : ""} ${movingCanvas ? "moving" : ""}`}
                onMouseDown={canvasMouseDown}
                onMouseUp={canvasMouseUp} onMouseMove={canvasMouseMove}></canvas>
    )
}