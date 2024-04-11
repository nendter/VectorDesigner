export class Rectangle{
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    contains(point){
        return (point.x >= this.x &&
                point.x <= this.x + this.width &&
                point.y >= this.y &&
                point.y <= this.y + this.height);
    }

    intersects(rect){
        return !(rect.x > this.x + this.width ||
                 rect.x + rect.width < this.x ||
                 rect.y > this.y + this.height ||
                 rect.y + rect.height < this.y)
    }
}