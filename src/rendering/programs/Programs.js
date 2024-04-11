export const ProgramAttributeTypeDefinition = {
    Float: {
        getType: (gl) => gl.FLOAT,
        convertToType: (value) => new Float32Array(value),
        byteSize: 4,
    }
}
export const ProgramAttributeUsageDefinition = {
    Static: (gl) => gl.STATIC_DRAW,
    Dynamic: (gl) => gl.DYNAMIC_DRAW,
}

export const ProgramUniformTypeDefinition = {
    Mat4: {
        uniformValue: (gl, uniformLocation, floatArr) => gl.uniformMatrix4fv(uniformLocation, false, floatArr)
    }
}


export const ProgramVerticesAttributeKey = "vertices";
export const ProgramDefinition = {
    Triangle: {
        shadersSource: "/shaders/triangle/",
        attributes: {
            [ProgramVerticesAttributeKey]: {
                size: 2,
                type: ProgramAttributeTypeDefinition.Float,
                usage: ProgramAttributeUsageDefinition.Static
            }, "position": {
                size: 2,
                type: ProgramAttributeTypeDefinition.Float,
                usage: ProgramAttributeUsageDefinition.Dynamic,
            }, "size": {
                size: 2,
                type: ProgramAttributeTypeDefinition.Float,
                usage: ProgramAttributeUsageDefinition.Dynamic,
            }, "rotation": {
                size: 1,
                type: ProgramAttributeTypeDefinition.Float,
                usage: ProgramAttributeUsageDefinition.Dynamic
            }, "color": {
                size: 4,
                type: ProgramAttributeTypeDefinition.Float,
                usage: ProgramAttributeUsageDefinition.Dynamic
            }
        },
        uniforms: {
            "vMatrix": {
                type: ProgramUniformTypeDefinition.Mat4
            },
            "pMatrix": {
                type: ProgramUniformTypeDefinition.Mat4
            }
        }
    },
}