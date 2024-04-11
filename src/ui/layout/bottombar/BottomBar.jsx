import "./BottomBar.css";

export function BottomBar({ children }){
    return (
        <div className={"bottom-bar"}>
            <div className="row">
                {children}
            </div>
        </div>
    )
}