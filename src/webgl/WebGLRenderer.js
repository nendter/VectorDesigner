import {CanvasUtils} from "./utils/CanvasUtils";
import {mat4} from "gl-matrix";
import {ProgramDefinition, ProgramVerticesAttributeKey} from "./programs/Programs";
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
                this.loadLayers(this._unrenderedLayers);
                this.render();
            }
        });
    }


    async _initAll(){
        this._initVPMatrices();
        await this._initPrograms();
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
        for(const programKey of Object.keys(ProgramDefinition)){
            const programDef = ProgramDefinition[programKey];
            const program = this._gl.createProgram();

            const vertexShader = await ShaderUtils.createAndCompileShader(this._gl.VERTEX_SHADER, programDef.shadersSource + "shader.vert", this._gl);
            const fragmentShader = await ShaderUtils.createAndCompileShader(this._gl.FRAGMENT_SHADER, programDef.shadersSource + "shader.frag", this._gl);
            this._gl.attachShader(program, vertexShader);
            this._gl.attachShader(program, fragmentShader);
            this._gl.linkProgram(program);

            const attributes = new Map();
            for(let attributeKey of Object.keys(programDef.attributes)){
                const location = this._gl.getAttribLocation(program, attributeKey);
                if(-1 < location){
                    this._gl.enableVertexAttribArray(location);
                    const buffer = this._initArrayBufferForAttribute(programDef.attributes[attributeKey], location);
                    const attribute = {
                        location: location,
                        buffer: buffer
                    }
                    attributes.set(attributeKey, attribute);
                }
            }

            const uniforms = new Map();
            for(let uniformKey of Object.keys(programDef.uniforms)){
                uniforms.set(uniformKey, this._gl.getUniformLocation(program, uniformKey));
            }

            this._programs.set(programKey, {
                program: program,
                attributes: attributes,
                uniforms: uniforms,
            })
        }
    }

    _initArrayBufferForAttribute(attribute, location){
        const buffer = this._gl.createBuffer();
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, buffer);
        this._gl.vertexAttribPointer(
            location,
            attribute.size,
            attribute.type.getType(this._gl),
            false,
            0,
            0
        )
        return buffer;
    }


    loadLayers(layers){
        if(!this._programs){
            this._unrenderedLayers = layers;
            return;
        }
        this._unrenderedLayers = undefined;
        this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);

        this._programDataMap = new Map();
        for(let layer of Object.values(layers)){
            const program = this._programs.get(layer.type.program);
            if(!program){
                this._unrenderedLayers = layers;
                return;
            }
            let data = this._programDataMap.get(layer.type.program);
            if(!data){
                data = {
                    [ProgramVerticesAttributeKey]: []
                };
                this._programDataMap.set(layer.type.program, data);
            }

            layer.webGlMeta = {
                offsets: {}
            };

            const layerTypeDataGenerator = LayerTypeDataGenerator[layer.type.id];
            const nonVertexAttributes = Array.from(program.attributes.keys()).filter(k => k !== ProgramVerticesAttributeKey);
            for(let vertices of layerTypeDataGenerator.generateVertices()){
                data[ProgramVerticesAttributeKey].push(...vertices);
                for(let attributeKey of nonVertexAttributes){
                    if(!data[attributeKey]){
                        data[attributeKey] = [];
                    }
                    if(layer.webGlMeta.offsets[attributeKey] === undefined){
                        layer.webGlMeta.offsets[attributeKey] = data[attributeKey].length;
                    }
                    const dataToPush = layer[attributeKey];
                    if(dataToPush instanceof Array){
                        data[attributeKey].push(...dataToPush);
                    }else{
                        data[attributeKey].push(dataToPush);
                    }
                }
            }
        }

        for(let programKey of this._programDataMap.keys()){
            const program = this._programs.get(programKey);
            const data = this._programDataMap.get(programKey);
            for(let attributeKey of Object.keys(data)){
                const attribute = program.attributes.get(attributeKey);
                const attributeDef = ProgramDefinition[programKey].attributes[attributeKey];
                this._gl.bindBuffer(this._gl.ARRAY_BUFFER, attribute.buffer);
                this._gl.bufferData(this._gl.ARRAY_BUFFER, attributeDef.type.convertToType(data[attributeKey]), attributeDef.usage(this._gl))
            }
        }

        this._loadedLayers = layers;
    }

    updateLayer(change){
        if(!this._loadedLayers){
            return;
        }
        let layer = this._loadedLayers[change.layerId];
        if(!layer || !layer.webGlMeta){
            return;
        }

        const program = this._programs.get(layer.type.program);
        const programDef = ProgramDefinition[layer.type.program];
        const layerTypeDataGenerator = LayerTypeDataGenerator[layer.type.id];

        for(let updateKey of Object.keys(change.updatedFields)){
            const attribute = program.attributes.get(updateKey);
            const attributeDef = programDef.attributes[updateKey];
            const newData = ArrayUtils.repeat(change.updatedFields[updateKey], layerTypeDataGenerator.vertexAmount);
            this._gl.bindBuffer(this._gl.ARRAY_BUFFER, attribute.buffer);
            this._gl.bufferSubData(
                this._gl.ARRAY_BUFFER,
                layer.webGlMeta.offsets[updateKey]*attributeDef.type.byteSize,
                attributeDef.type.convertToType(newData)
            );
        }
    }


    render(){
        if(!this._programs){
            return;
        }

        for(let programKey of this._programs.keys()){
            const program = this._programs.get(programKey);
            if(!program){
                return;
            }

            this._gl.useProgram(program.program);

            this._gl.uniformMatrix4fv(program.uniforms.get("vMatrix"), false, this._vMatrix);
            this._gl.uniformMatrix4fv(program.uniforms.get("pMatrix"), false, this._pMatrix);

            const triangleAmount = this._programDataMap.get(programKey)[ProgramVerticesAttributeKey].length/ProgramDefinition[programKey].attributes[ProgramVerticesAttributeKey].size;

            this._gl.drawArrays(
                this._gl.TRIANGLES,
                0,
                triangleAmount
            );
        }

    }

}