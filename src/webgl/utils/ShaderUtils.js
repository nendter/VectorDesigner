export class ShaderUtils{
    static async createAndCompileShader(type, sourceUrl, gl){
        const shader = gl.createShader(type);
        const source = await this.loadFromUrl(sourceUrl);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return shader;
    }

    static async loadFromUrl(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load shader: ${response.statusText}`);
        }
        return await response.text();
    }
}