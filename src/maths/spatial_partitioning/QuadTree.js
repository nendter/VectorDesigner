import {Rectangle} from "../geometry/Rectangle";

export class QuadTree{
    constructor(rect, capacity) {
        this._rect = rect;
        this._capatiy = capacity;

        this._points = [];
        this._divided = false;
    }

    _subdivide(){
        const {x, y, width, height} = this._rect;
        const newWidth = width / 2;
        const newHeight = height / 2;

        this._northWest = new QuadTree(new Rectangle(x, y, newWidth, newHeight), this._capatiy);
        this._northEast = new QuadTree(new Rectangle(x + newWidth, y, newWidth, newHeight), this._capatiy);
        this._southWest = new QuadTree(new Rectangle(x, y + newHeight, newWidth, newHeight), this._capatiy);
        this._southEast = new QuadTree(new Rectangle(x + newWidth, y + newHeight, newWidth, newHeight), this._capatiy);

        this._divided = true;
    }

    insert(point){
        if(!this._rect.contains(point)){
            return false;
        }

        if(this._points.length < this._capatiy){
            this._points.push(point);
            return true;
        }

        if(!this._divided){
            this._subdivide();
        }

        return this._northWest.insert(point) ||this._northEast.insert(point)
            || this._southWest.insert(point) || this._southEast.insert(point)
    }

    query(rect, found = []){
        if(!this._rect.intersects(rect)){
            return found;
        }

        for(let p of this._points){
            if(rect.contains(p)){
                found.push(p);
            }
        }

        if(!this._divided){
            return found;
        }

        this._northWest.query(rect, found);
        this._northEast.query(rect, found);
        this._southWest.query(rect, found);
        this._southEast.query(rect, found);

        return found;
    }

}