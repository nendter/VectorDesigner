precision mediump float;
attribute vec2 position;

uniform mat4 mvpMatrix;

void main(){
    gl_Position = mvpMatrix * vec4(position, 0, 1);
}