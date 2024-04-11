import "./NarrowNumberInput.css";

export function NarrowNumberInput({ label, value, onChange }){
    return (
        <div className={"input narrow-number-input"}>
            <label>{label}</label>
            <input type={"number"} placeholder={`${label}...`} value={value} onChange={onChange}/>
        </div>
    )
}