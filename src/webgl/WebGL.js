import {CanvasUtils} from "./utils/CanvasUtils";

export class WebGL{
    canvas;
    gl;

    constructor(canvas) {
        this.canvas = canvas;
        CanvasUtils.resizeInternalToClient(this.canvas);

        this.gl = canvas.getContext("webgl");
        if(!this.gl){
            throw new Error("WebGL not supported!")
        }
    }

    drawTriangle(){

    }

}