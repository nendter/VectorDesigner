export class ArrayUtils{
    static repeat(arr, n){
        const res = [];
        for(let i = 0; i < n; i++){
            if(arr instanceof Array){
                res.push(...arr)
            }else{
                res.push(arr)
            }
        }
        return res;
    }
}