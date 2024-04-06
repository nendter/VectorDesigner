import {createContext, useState} from "react";
import {EditorTools} from "./toolbar/EditorToolBar";

export const EditorContext = createContext(undefined);

export function EditorContextProvider({ children }){
    const [tool, setTool] = useState(EditorTools[0]);
    const [zoom, setZoom] = useState(1);
    return (
        <EditorContext.Provider value={{
            tool: tool,
            setTool: setTool,

            zoom: zoom,
            setZoom: setZoom
        }}>
            {children}
        </EditorContext.Provider>
    )
}