import "./BottomBar.css";
import {Icon, Icons} from "../../icon/Icon";

export function BottomBar({ children }){
    return (
        <div className={"bottom-bar"}>
            <div className="row">
                {children}
            </div>
        </div>
    )
}