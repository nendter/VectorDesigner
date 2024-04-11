import "./ProfileImage.css";

export function ProfileImage({ initials }){
    return (
        <button className={"profile-image"}>
            <p className="initials">{initials}</p>
        </button>
    )
}