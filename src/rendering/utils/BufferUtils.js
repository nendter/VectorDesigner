export class BufferUtils{
    /**
     * Shortcut for creating a Float32Array Buffer in a WebGL-Context, moving the array to the buffer and
     * assigning it to a vertex-attribute with a group size for each vertex
     * @param gl WebGL-Context
     * @param arr The array that should be moved to the buffer
     * @param usage The usage of the buffer (e.g. STATIC_DRAW)
     * @param vertexAttributeLocation The location of the attribute to use
     * @param groupSize The group-size of floatArray used for each vertex
     */
    static createArrayBufferForVertexAttribute(gl, arr, usage, vertexAttributeLocation, groupSize){
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(
            vertexAttributeLocation,
            groupSize,
            gl.FLOAT,
            false,
            0,
            0
        );
        return buffer;
    }
}