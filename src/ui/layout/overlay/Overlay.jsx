import "./Overlay.css";
import {Icon, Icons} from "../../icon/Icon";
import {useState} from "react";

export function Overlay({ title, children }){
    const [closed, setClosed] = useState(false);
    return (
        <div className={"overlay"}>
            <div className="overlay-head">
                <p className="overlay-title">{title}</p>
                <button className={"size-20 settings"} onClick={() => setClosed(!closed)}>
                    <Icon icon={closed ? Icons.Plus:Icons.Minus}></Icon>
                </button>
            </div>
            {!closed && <div className="overlay-content">
                {children}
            </div>}
        </div>
    )
}