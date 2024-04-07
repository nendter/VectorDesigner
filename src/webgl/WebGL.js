import {CanvasUtils} from "./utils/CanvasUtils";
import {ShaderUtils} from "./utils/ShaderUtils";
import {glMatrix, mat4} from "gl-matrix";

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

    async drawTriangle(){

        // Position Data
        const positionDataVertexSize = 2;
        const positionData = [
            0, 1,
            1, -1,
            -1, -1,
        ]

        // Where is this triangle in world space
        const modelMatrix = mat4.create();
        mat4.scale(modelMatrix, modelMatrix, [.25, .25, .25]);
        // Where is the camera in world space
        const viewMatrix = mat4.create();
        // How is the projection of view space
        const projectionMatrix = this.createOrthogonalProjectionMatrix();

        const mvpMatrix = mat4.create();
        mat4.multiply(mvpMatrix, projectionMatrix, viewMatrix);
        mat4.multiply(mvpMatrix, mvpMatrix, modelMatrix);

        // Read position data into buffer
        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positionData), this.gl.STATIC_DRAW);

        // Create and compile shaders
        const vertexShader = await ShaderUtils.createAndCompileShader(this.gl.VERTEX_SHADER, "/shaders/shader.vert", this.gl);
        const fragmentShader = await ShaderUtils.createAndCompileShader(this.gl.FRAGMENT_SHADER, "/shaders/shader.frag", this.gl);

        // Create a program
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);

        // Define buffer > attribute parsing
        const positionAttrLocation = this.gl.getAttribLocation(program, "position");
        this.gl.enableVertexAttribArray(positionAttrLocation);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.vertexAttribPointer(positionAttrLocation, positionDataVertexSize, this.gl.FLOAT, false, 0, 0);

        // Get Uniform Locations
        const mvpMatrixUniformLocation = this.gl.getUniformLocation(program, "mvpMatrix");

        // Tell Gl what program to use for the draw operation
        this.gl.useProgram(program);

        // Parse uniform values
        this.gl.uniformMatrix4fv(mvpMatrixUniformLocation, false, mvpMatrix);

        // Draw The buffer
        this.gl.drawArrays(this.gl.TRIANGLES, 0, positionData.length/positionDataVertexSize);

    }

    createOrthogonalProjectionMatrix(){
        let left, right, bottom, top;

        const aspectRatio = this.canvas.width / this.canvas.height;
        const viewHeight = 2.0; // Defines what the min and max y position is, that's rendered (e.g. 2 = -1 <-> 1)
        const viewWidth = viewHeight * aspectRatio;

        left = -viewWidth / 2;
        right = viewWidth / 2;
        bottom = -viewHeight / 2;
        top = viewHeight / 2;

        return mat4.ortho(mat4.create(), left, right, bottom, top, 1e-4, 1e4);
    }

}