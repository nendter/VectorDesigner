import {useEffect, useRef} from "react";


export function useKeyTracker(cbs = {}){

    const keyMapRef = useRef({});

    const onKeyDown = (ev) => {
        keyMapRef.current[ev.key] = true;
        if(cbs[ev.key]){
            cbs[ev.key](true);
        }
    }

    const onKeyUp = (ev) => {
        keyMapRef.current[ev.key] = false;
        if(cbs[ev.key]){
            cbs[ev.key](false);
        }
    }

    useEffect(() => {
        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("keyup", onKeyUp)
        return () => {
            document.removeEventListener("keydown", onKeyDown)
            document.removeEventListener("keyup", onKeyUp)
        }
    }, []);

    return keyMapRef;
}