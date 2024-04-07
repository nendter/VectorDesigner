import {CanvasUtils} from "./utils/CanvasUtils";
import {mat4} from "gl-matrix";
import {Program} from "./programs/Programs";
import {ShaderUtils} from "./utils/ShaderUtils";
import {LayerType, LayerTypeDataGenerator} from "./layers/LayerTypes";
import {BufferUtils} from "./utils/BufferUtils";

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

        this._initVPMatrices();
        this._initPrograms().then(() => {
            if(this._openLayerRender){
                this.initLayers(this._openLayerRender);
            }
        });
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


    initLayers(layers){
        if(!this._programs){
            this._openLayerRender = layers;
            return;
        }
        this._openLayerRender = undefined;
        this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);

        const triangleProgramData = {
            vertices: [],
            positions: [],
            sizes: [],
            rotations: [],
            colors: []
        }
        for(const layer of layers){
            switch(layer.type.programId){
                case Program.Triangle.id:
                    const dataGenerator = LayerTypeDataGenerator[layer.type.id];
                    for(let vertices of dataGenerator.generateVertices()){
                        triangleProgramData.vertices.push(...vertices);
                        triangleProgramData.positions.push(...layer.position);
                        triangleProgramData.sizes.push(...layer.size);
                        triangleProgramData.rotations.push(layer.rotation);
                        triangleProgramData.colors.push(...layer.fill);
                    }
                    break;
            }
        }

        const triangleProgram = this._programs.get(Program.Triangle.id);
        if(!triangleProgram){
            this._openLayerRender = layers;
            return;
        }

        this._triangleProgramDataVerticesBuffer = BufferUtils.createArrayBufferForVertexAttribute(
            this._gl,
            triangleProgramData.vertices,
            this._gl.STATIC_DRAW,
            triangleProgram.attributes.get("vertices"),
            2
        );

        this._triangleProgramDataPositionBuffer = BufferUtils.createArrayBufferForVertexAttribute(
            this._gl,
            triangleProgramData.positions,
            this._gl.DYNAMIC_DRAW,
            triangleProgram.attributes.get("position"),
            2
        );

        this._triangleProgramDataSizeBuffer = BufferUtils.createArrayBufferForVertexAttribute(
            this._gl,
            triangleProgramData.sizes,
            this._gl.DYNAMIC_DRAW,
            triangleProgram.attributes.get("size"),
            2
        );

        this._triangleProgramDataRotationBuffer = BufferUtils.createArrayBufferForVertexAttribute(
            this._gl,
            triangleProgramData.rotations,
            this._gl.DYNAMIC_DRAW,
            triangleProgram.attributes.get("rotation"),
            1
        );

        this._triangleProgramDataRotationBuffer = BufferUtils.createArrayBufferForVertexAttribute(
            this._gl,
            triangleProgramData.colors,
            this._gl.DYNAMIC_DRAW,
            triangleProgram.attributes.get("color"),
            4
        );

        this._gl.useProgram(triangleProgram.program);

        this._gl.uniformMatrix4fv(triangleProgram.uniforms.get("vMatrix"), false, this._vMatrix);
        this._gl.uniformMatrix4fv(triangleProgram.uniforms.get("pMatrix"), false, this._pMatrix);

        this._gl.drawArrays(this._gl.TRIANGLES, 0, triangleProgramData.vertices.length/2);

        this._renderedLayers = layers;
    }

    rerenderLayer(layer){

    }

}