import {FullScreenLayout} from "../layout/fullscreen/FullScreenLayout";
import {TopBar} from "../layout/topbar/TopBar";
import {EditorToolBar, EditorTools} from "./toolbar/EditorToolBar";
import {EditorContext, EditorContextProvider} from "./EditorContextProvider";
import "./EditorRoute.css";
import {BottomBar} from "../layout/bottombar/BottomBar";
import {Canvas} from "./canvas/Canvas";
import {Icon, Icons} from "../icon/Icon";
import {useContext} from "react";

export function EditorRoute(){
    const editorCtx = useContext(EditorContext);
    return (
        <EditorContextProvider>
            <FullScreenLayout>
                <TopBar>
                    <div className="editor-top-bar-content">
                        <EditorToolBar></EditorToolBar>
                        <button className="primary">
                            <p>Export</p>
                        </button>
                    </div>
                </TopBar>
                <Canvas></Canvas>
                <BottomBar>
                    <div className="zoom">
                        <button className={"size-18"}>
                            <Icon icon={Icons.Plus}></Icon>
                        </button>
                        <p>{ ((editorCtx?.zoom ?? 1) * 100).toFixed(0) }%</p>
                        <button className={"size-18"}>
                            <Icon icon={Icons.Minus}></Icon>
                        </button>
                    </div>
                </BottomBar>
            </FullScreenLayout>
        </EditorContextProvider>
    )
}