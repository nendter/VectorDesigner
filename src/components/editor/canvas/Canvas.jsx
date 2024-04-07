import "./Canvas.css";
import {useEffect, useRef} from "react";
import {WebGL} from "../../../webgl/WebGL";

export function Canvas(){
    const ref = useRef();
    const webgl = useRef(undefined);
    useEffect(() => {
        webgl.current = new WebGL(ref.current);
        webgl.current.drawTriangle().then(() => {
            console.log("Drew Triangle!")
        });
    }, [ref]);
    return (
        <canvas ref={ref} className={"canvas"}></canvas>
    )
}