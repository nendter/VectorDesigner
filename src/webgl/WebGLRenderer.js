import {CanvasUtils} from "./utils/CanvasUtils";
import {mat4} from "gl-matrix";
import {Program} from "./programs/Programs";
import {ShaderUtils} from "./utils/ShaderUtils";
import {LayerType, LayerTypeDataGenerator} from "./layers/LayerTypes";
import {BufferUtils} from "./utils/BufferUtils";
import {ArrayUtils} from "./utils/ArrayUtils";

/**
 * Height of the canvas in webgl "units".
 * Default: 2.0 => minY=-1, maxY=1
 * @type {number}
 */
export const CANVAS_WEBGL_HEIGHT = 2.0;

export class WebGLRenderer{
    constructor(canvas) {
        this._canvas = canvas;
        CanvasUtils.resizeInternalToClient(this._canvas);

        this._gl = canvas.getContext("webgl");
        if(!this._gl){
            throw new Error("WebGL not supported!")
        }

        this._initAll().then(() => {
            if(this._unrenderedLayers){
                this.loadLayerData(this._unrenderedLayers);
                this.render();
            }
        });
    }


    async _initAll(){
        this._initVPMatrices();
        await this._initPrograms();
        await this._initBuffers();
    }


    _initVPMatrices(){
        this._vMatrix = mat4.create();
        this._pMatrix = this._createPMatrix();
    }

    _createPMatrix(){
        const canvasAspectRatio = this._canvas.width / this._canvas.height;
        const canvasWebGLWidth = CANVAS_WEBGL_HEIGHT * canvasAspectRatio;

        return mat4.ortho(mat4.create(),
            -canvasWebGLWidth / 2,
            canvasWebGLWidth / 2,
            -CANVAS_WEBGL_HEIGHT / 2,
            CANVAS_WEBGL_HEIGHT / 2,
            1e-4,
            1e4)
    }


    async _initPrograms(){
        this._programs = new Map();
        for(const programDef of Object.values(Program)){
            const program = this._gl.createProgram();

            const vertexShader = await ShaderUtils.createAndCompileShader(this._gl.VERTEX_SHADER, programDef.shadersSource + "shader.vert", this._gl);
            const fragmentShader = await ShaderUtils.createAndCompileShader(this._gl.FRAGMENT_SHADER, programDef.shadersSource + "shader.frag", this._gl);
            this._gl.attachShader(program, vertexShader);
            this._gl.attachShader(program, fragmentShader);
            this._gl.linkProgram(program);

            const uniforms = new Map();
            for(let uniform of programDef.uniforms){
                uniforms.set(uniform, this._gl.getUniformLocation(program, uniform));
            }

            const attributes = new Map();
            for(let attribute of programDef.attributes){
                const location = this._gl.getAttribLocation(program, attribute);
                if(-1 < location){
                    this._gl.enableVertexAttribArray(location);
                    attributes.set(attribute, location);
                }
            }

            this._programs.set(programDef.id, {
                program: program,
                uniforms: uniforms,
                attributes: attributes
            })
        }
    }


    async _initBuffers(){
        const triangleProgram = this._programs.get(Program.Triangle.id);
        triangleProgram.buffers = {};

        triangleProgram.buffers.vertices = this._initFloatArrayBufferForAttribute(
            triangleProgram.attributes.get("vertices"),
            2);
        triangleProgram.buffers.position = this._initFloatArrayBufferForAttribute(
            triangleProgram.attributes.get("position"),
            2);
        triangleProgram.buffers.size = this._initFloatArrayBufferForAttribute(
            triangleProgram.attributes.get("size"),
            2);
        triangleProgram.buffers.rotation = this._initFloatArrayBufferForAttribute(
            triangleProgram.attributes.get("rotation"),
            1);
        triangleProgram.buffers.color = this._initFloatArrayBufferForAttribute(
            triangleProgram.attributes.get("color"),
            4);
    }

    _initFloatArrayBufferForAttribute(attributeLoc, groupSize){
        const buffer = this._gl.createBuffer();
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, buffer);
        this._gl.vertexAttribPointer(
            attributeLoc,
            groupSize,
            this._gl.FLOAT,
            false,
            0,
            0
        );
        return buffer;
    }


    loadLayerData(layers){
        if(!this._programs){
            this._unrenderedLayers = layers;
            return;
        }
        this._unrenderedLayers = undefined;
        this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);

        const triangleProgram = this._programs.get(Program.Triangle.id);
        if(!triangleProgram){
            this._unrenderedLayers = layers;
            return;
        }

        triangleProgram.data = {
            vertices: [],
            position: [],
            size: [],
            rotation: [],
            color: []
        }
        for(const layer of layers){
            switch(layer.type.programId){
                case Program.Triangle.id:
                    const dataGenerator = LayerTypeDataGenerator[layer.type.id];
                    for(let vertices of dataGenerator.generateVertices()){
                        triangleProgram.data.vertices.push(...vertices);
                        triangleProgram.data.position.push(...layer.position);
                        triangleProgram.data.size.push(...layer.size);
                        triangleProgram.data.rotation.push(layer.rotation);
                        triangleProgram.data.color.push(...layer.fill);
                    }
                    break;
            }
        }

        for(let attribute of Object.keys(triangleProgram.buffers)){
            this._gl.bindBuffer(this._gl.ARRAY_BUFFER, triangleProgram.buffers[attribute]);
            this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(triangleProgram.data[attribute]),  attribute === "vertices" ? this._gl.STATIC_DRAW:this._gl.DYNAMIC_DRAW);
        }

        this._loadedLayers = layers;
    }

    updateLayerData(change){
        if(!this._loadedLayers || this._loadedLayers.length < 1){
            return;
        }
        let layer;
        let layerIndex;
        for(let i = 0; i < this._loadedLayers.length; i++){
            const l = this._loadedLayers[i];
            if(l.id === change.layerId){
                layer = l;
                layerIndex = i;
                break;
            }
        }
        if(!layer){
            return;
        }

        console.log("layerIndex")
        console.log(layerIndex);

        const triangleProgram = this._programs.get(Program.Triangle.id);
        for(let updateKey of Object.keys(change.updatedFields)){
            switch(updateKey){
                case "position":
                    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, triangleProgram.buffers.position);
                    this._gl.bufferSubData(this._gl.ARRAY_BUFFER,
                        layerIndex*(3*2),
                        new Float32Array(
                            ArrayUtils.repeat(change.updatedFields[updateKey], 3)
                        ));
                    break;
            }
        }
    }


    render(){
        if(!this._programs){
            return;
        }

        const triangleProgram = this._programs.get(Program.Triangle.id);
        if(!triangleProgram){
            return;
        }

        this._gl.useProgram(triangleProgram.program);

        this._gl.uniformMatrix4fv(triangleProgram.uniforms.get("vMatrix"), false, this._vMatrix);
        this._gl.uniformMatrix4fv(triangleProgram.uniforms.get("pMatrix"), false, this._pMatrix);

        this._gl.drawArrays(this._gl.TRIANGLES, 0, triangleProgram.data.vertices.length/2);
    }

}