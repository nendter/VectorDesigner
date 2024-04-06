import {Icon, Icons} from "../../icon/Icon";
import "./EditorToolBar.css";
import {useContext} from "react";
import {EditorContext} from "../EditorContextProvider";

export const EditorTools = [
    {
        id: "shape",
        icon: Icons.Rectangle,
    },
    {
        id: "pen",
        icon: Icons.Pen
    }
]

export function EditorToolBar(){
    const editorCtx = useContext(EditorContext);
    return (
        <div className={"editor-toolbar"}>
            {EditorTools.map(tool =>
                <button key={tool.id}
                        className={`tool ${editorCtx.tool?.id === tool.id ? "selected":""}`}
                        onClick={() => editorCtx.setTool(tool)}>
                    <Icon icon={tool.icon}></Icon>
                </button>
            )}
        </div>
    )
}