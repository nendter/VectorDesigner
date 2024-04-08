export class ArrayUtils{
    static repeat(arr, n){
        const res = [...arr];
        for(let i = 0; i < n; i++){
            res.push(...arr)
        }
        return res;
    }
}