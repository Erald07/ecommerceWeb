import { useState } from "react";
import { Link } from "react-router-dom";
import "./InputForm.css";

const InputForm = (props) => {
    const [focused, setFocused] = useState(false);
    const {label, errorMessage, validatee, butoni, message, className, onChange, id, ...inputProps} = props;

    const handleFocus = (e) => {
        setFocused(true);
    };

    return(
        <div className="mb-4">
            <label>{label}</label>
            <button className="float-right text-gray-500 pt-4 text-lg justify-between -translate-x-9">{butoni}</button>
            <input {...inputProps} onChange={onChange} onBlur={handleFocus} onFocus={() => inputProps.name === "confirmEmail" && setFocused(true) } focused={focused.toString()} className={className} />
            <div>{validatee}</div>
            <span className="text-xs text-right px-3 text-primary hidden">{errorMessage}</span>
            <p className="text-xs text-gray-500 px-3">{message}</p>
        </div>
    );
}

export default InputForm;