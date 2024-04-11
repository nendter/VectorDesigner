export class CanvasUtils{
    static resizeInternalToClient(canvas){
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }
}