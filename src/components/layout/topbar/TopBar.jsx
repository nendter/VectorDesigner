import "./TopBar.css";
import {Icon, Icons} from "../../icon/Icon";
import {ProfileImage} from "../../social/profile/image/ProfileImage";

export function TopBar({ children }){
    return (
        <div className={"top-bar"}>
            <div className={"main"}>
                <Icon className={"logo"} icon={Icons.VectorLogo}></Icon>
                <h2>Vector</h2>
                <button className={"size-20 settings"}>
                    <Icon icon={Icons.Gear}></Icon>
                </button>
            </div>
            <div className="content">{children}</div>
            <div className="social">
                <button className={"size-20 bell"}>
                    <Icon icon={Icons.Bell}></Icon>
                </button>
                <ProfileImage initials={"J"}></ProfileImage>
            </div>
        </div>
    )
}