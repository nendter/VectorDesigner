precision mediump float;

attribute vec2 vertices;
attribute vec2 position;
attribute vec2 size;
attribute float rotation;
attribute vec4 color;

uniform mat4 vMatrix;
uniform mat4 pMatrix;

void main(){
    mat4 translationMatrix = mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        position.x, position.y, 0.0, 1.0
    );
    mat4 scalingMatrix = mat4(
        size.x, 0.0, 0.0, 0.0,
        0.0, size.y, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    );

    mat4 modelMatrix = translationMatrix * scalingMatrix;

    gl_Position = pMatrix * vMatrix * modelMatrix * vec4(vertices, 0, 1);
}