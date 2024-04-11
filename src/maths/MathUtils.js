import {Point} from "./geometry/Point";

export class MathUtils {
    /**
     * @param n any positive or negative **integer**
     * @returns {number} unique positive number
     */
    static asUniquePositive(n){
        return n >= 0 ? 2 * n : -2 * n - 1;
    }

    /**
     * @param point takes point coordinates (x, y) as an object
     * @param negatives should negative numbers be supported (**by default only positive numbers work**)
     * @param decimals if decimals should be supported, the number of decimal places to consider
     * @returns {number} unique positive number for the point
     */
    static cantorPairing(point, negatives = true, decimals = null){
        let x = point.x;
        let y = point.y;
        if(decimals){
            x = Math.round(x * Math.pow(10, decimals));
            y = Math.round(y * Math.pow(10, decimals));
        }
        if(negatives){
            x = MathUtils.asUniquePositive(x);
            y = MathUtils.asUniquePositive(y);
        }
        return ((x + y) * (x + y + 1)) / 2 + y;
    }
}