import {CanvasUtils} from "./utils/CanvasUtils";
import {ShaderUtils} from "./utils/ShaderUtils";
import {glMatrix, mat4} from "gl-matrix";

export class WebGLTest {
    canvas;
    gl;

    triangles




    vMatrix; // changes, if the position of the camera changes
    pMatrix; // changes, if the aspect ratio of the canvas changes

    vpMatrix; // current multiplication of pv, needs to be recalculated, if p or v changes

    defaultProgram; // Receives vec2 triangle information and renders it blue
    defaultProgramUniforms; // Uniforms used in the default program
    defaultProgramAttributes; // Attributes used in the default program

    constructor(canvas) {
        this.canvas = canvas;
        CanvasUtils.resizeInternalToClient(this.canvas);

        this.gl = canvas.getContext("webgl");
        if(!this.gl){
            throw new Error("WebGL not supported!")
        }
    }

    async createDefaults(){
        this.createDefaultVpMatrices();
        await this.createAndLinkDefaultProgram();
    }

    // Matrix Operations
    createDefaultVpMatrices(){
        // Where is the camera in world space
        this.vMatrix = mat4.create();
        // How is the projection of view space
        this.pMatrix = this.createDefaultOrthogonalProjectionMatrix();

        this.updateVpMatrix();
    }
    createDefaultOrthogonalProjectionMatrix(){
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
    updateVpMatrix(){
        if(this.vpMatrix === undefined){
            this.vpMatrix = mat4.create();
        }
        mat4.multiply(this.vpMatrix, this.pMatrix, this.vMatrix);
    }

    // Shader Operations
    async createAndLinkDefaultProgram(){
        // Create and compile shaders
        const vertexShader = await ShaderUtils.createAndCompileShader(this.gl.VERTEX_SHADER, "/shaders/shader.vert", this.gl);
        const fragmentShader = await ShaderUtils.createAndCompileShader(this.gl.FRAGMENT_SHADER, "/shaders/shader.frag", this.gl);

        // Create a program
        this.defaultProgram = this.gl.createProgram();
        this.gl.attachShader(this.defaultProgram, vertexShader);
        this.gl.attachShader(this.defaultProgram, fragmentShader);
        this.gl.linkProgram(this.defaultProgram);

        // Define uniform locations
        this.defaultProgramUniforms = {
            vpMatrix: this.gl.getUniformLocation(this.defaultProgram, "vpMatrix"),
            mMatrix: this.gl.getUniformLocation(this.defaultProgram, "mMatrix"),
        }

        const positionAttr = this.gl.getAttribLocation(this.defaultProgram, "position");
        this.gl.enableVertexAttribArray(positionAttr);
        this.defaultProgramAttributes = {
            position: positionAttr
        }
    }

    // Shape Operations
    async drawTriangle(){
        if(!this.defaultProgram){
            return;
        }

        // Position Data
        const positionData = [
            0, 1,
            1, -1,
            -1, -1,
        ]

        // Where is this triangle in world space
        const mMatrix = mat4.create();
        mat4.scale(mMatrix, mMatrix, [.25, .25, .25]);

        // Read position data into buffer
        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positionData), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.defaultProgramAttributes.position, 2, this.gl.FLOAT, false, 0, 0);

        this.drawWithDefaultProgram(positionData, mMatrix);
    }

    drawWithDefaultProgram(positionData, mMatrix){
        // Tell Gl what program to use for the draw operation
        this.gl.useProgram(this.defaultProgram);

        // Parse uniform values
        this.gl.uniformMatrix4fv(this.defaultProgramUniforms.vpMatrix, false, this.vpMatrix);
        this.gl.uniformMatrix4fv(this.defaultProgramUniforms.mMatrix, false, mMatrix);

        // Draw The buffer
        this.gl.drawArrays(this.gl.TRIANGLES, 0, positionData.length/2);
    }

}