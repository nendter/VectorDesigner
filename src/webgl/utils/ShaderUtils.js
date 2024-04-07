import {HttpUtils} from "../../utils/HttpUtils";

export class ShaderUtils{
    static async createAndCompileShader(type, sourceUrl, gl){
        const shader = gl.createShader(type);
        const source = await HttpUtils.fetchTextFromUrl(sourceUrl);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return shader;
    }
}